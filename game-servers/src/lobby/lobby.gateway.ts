import {OnGatewayConnection, OnGatewayInit, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import {Server, Socket}                                                        from "socket.io";
import * as io                                                                 from "socket.io-client";
import {RegisteredShard}                                                       from "../register/entities/registered-shard";
import {Events}                                                                from "../../lib/constants/events";
import {PORTS}                                                                 from "../../lib/constants/ports";

@WebSocketGateway()
export class LobbyGateway implements OnGatewayConnection, OnGatewayInit {
    @WebSocketServer()
    server: Server;
    socket: Socket;

    servers: RegisteredShard[] = [];

    handleConnection(client: Socket, ...args: any[]): any {
        console.log('send servers', this.servers);
        client.emit(Events.SERVER_LIST, this.servers);
    }

    afterInit(server: Server): any {
        this.socket = io('http://localhost:' + PORTS.REGISTER + '?track=false');
        this.socket.on(Events.SERVER_LIST, (data) => {
            console.log('servers', data);
            this.servers = data;
            server.emit(Events.SERVER_LIST, data);
        });
    }

}
