import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    WebSocketGateway,
    WebSocketServer
}                       from "@nestjs/websockets";
import {Server, Socket} from "socket.io";
import * as io          from "socket.io-client";
import {config}         from "../lib/config";
import {ShardService}   from "./shard.service";

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
        this.socket = io('http://' + config.servers.register.host + ':' + config.servers.register.port + '?name=' + this.names[process.env.NODE_APP_INSTANCE] + '&port=' + config.servers.shard.port);
    }

    async handleConnection(client: Socket, ...args: any[]) {
        try {
            if (this.service.users.length >= this.capacity) {
                throw new Error("User Capacity Reached");
            }
            await this.service.userConnected(client);
            this.update();
        } catch (e) {
            client.emit("connection-error", e.message);
            client.disconnect(true);
        }
    }

    async handleDisconnect(client: Socket) {
        await this.service.userDisconnected(client);
        this.update();
    }

    update() {
        this.socket.emit('update', {current: this.service.users.length, capacity: this.capacity});
    }
}
