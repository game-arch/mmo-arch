import {WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import {Server, Socket}                    from "socket.io";
import {PORTS}                             from "../constants";
import * as io                             from "socket.io-client";

@WebSocketGateway()
export class LobbyGateway {
    @WebSocketServer()
    server: Server;
    socket: Socket;

    constructor() {

        this.socket = io('http://localhost:' + PORTS.REGISTER + '?track=false');
        this.socket.on('servers', (data) => {
            this.server.send('servers', data);
        });
    }

}
