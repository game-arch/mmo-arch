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
    current  = 0;

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
            await this.service.getUserFor(client);
            this.current++;
            this.update();
        } catch (e) {
            client.disconnect(true);
        }
    }

    handleDisconnect(client: Socket): any {
        this.current--;
        if (this.current < 0) {
            this.current = 0;
        }
        this.update();
    }

    update() {
        this.socket.emit('update', {current: this.current, capacity: this.capacity});
    }
}
