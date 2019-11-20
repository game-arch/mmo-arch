import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    WebSocketGateway,
    WebSocketServer
}                       from "@nestjs/websockets";
import {Server, Socket} from "socket.io";
import * as io          from "socket.io-client";
import {config}         from "../../lib/config";
import {ShardService}   from "./shard.service";
import {Events}         from "../../../lib/constants/events";

@WebSocketGateway()
export class ShardGateway implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection {
    @WebSocketServer()
    server: Server;
    socket: Socket;

    capacity = 100;

    names = [
        'Maiden',
        'Voyage',
        'Alcatraz'
    ];

    constructor(private service: ShardService) {

    }

    afterInit(server: Server): any {
        this.socket = io('http://' + config.servers.presence.host + ':' + config.servers.presence.port + '?name=' + this.names[process.env.NODE_APP_INSTANCE] + '&port=' + config.servers.shard.port + '&capacity=' + this.capacity);
    }

    async handleConnection(client: Socket, ...args: any[]) {
        try {
            if (this.service.users.length >= this.capacity) {
                throw new Error("User Capacity Reached");
            }
            let user = await this.service.verifyUser(client);
            this.socket.emit(Events.USER_CONNECTED, {
                accountId: user.id,
                shard    : this.names[process.env.NODE_APP_INSTANCE]
            });
            client.emit(Events.CHARACTER_LIST, await this.service.getCharacters(client));
        } catch (e) {
            client.emit("connection-error", e.message);
            client.disconnect(true);
        }
    }

    async handleDisconnect(client: Socket) {
        let user = await this.service.getUser(client);
        this.socket.emit(Events.USER_DISCONNECTED, {
            accountId: user.id,
            shard    : this.names[process.env.NODE_APP_INSTANCE]
        });
    }
}
