import {OnGatewayConnection, OnGatewayInit, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import {Server, Socket}                                                        from "socket.io";
import * as io                                                                 from "socket.io-client";
import {RegisteredShard}                                                       from "../presence/entities/registered-shard";
import {Events}                                                                from "../../lib/constants/events";
import {config}                                                                from "../lib/config";

@WebSocketGateway()
export class LobbyGateway implements OnGatewayConnection, OnGatewayInit {
    @WebSocketServer()
    server: Server;
    socket: Socket;

    servers: RegisteredShard[] = [];

    handleConnection(client: Socket, ...args: any[]): any {
        client.emit(Events.SERVER_LIST, this.servers);
    }


    afterInit(server: Server): any {
        this.socket = io('http://' + config.servers.presence.host + ':' + config.servers.presence.port + '?track=false');
        this.socket.on(Events.SERVER_LIST, (data) => {
            this.servers = data;
            server.emit(Events.SERVER_LIST, data);
        });
    }

}
