import {
    OnGatewayConnection, OnGatewayDisconnect,
    OnGatewayInit,
    WebSocketGateway,
    WebSocketServer
}                       from "@nestjs/websockets";
import {Server, Socket} from "socket.io";
import {Events}         from "../../../lib/constants/events";
import {LobbyService}   from "./lobby.service";
import {GameWorld}      from "../../../lib/entities/game-world";
import {PresenceClient} from "../../microservice/presence/client/presence.client";

@WebSocketGateway()
export class LobbyGateway implements OnGatewayConnection, OnGatewayInit {
    @WebSocketServer()
    server: Server;
    socket: Socket;
    servers: GameWorld[] = [];

    constructor(private service: LobbyService, private presence: PresenceClient) {

    }

    async handleConnection(client: Socket, ...args: any[]) {
        try {
            await this.service.getAccount(client);
            client.emit(Events.SERVER_LIST, this.servers);
        } catch (e) {
            client.emit('connect-error', 'Not Authorized');
            client.disconnect(true);
        }
    }


    async afterInit(server: Server) {
        this.servers = await this.presence.getServers();
    }
}
