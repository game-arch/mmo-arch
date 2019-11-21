import {
    OnGatewayConnection,
    OnGatewayInit,
    WebSocketGateway,
    WebSocketServer
}                       from "@nestjs/websockets";
import {Server, Socket} from "socket.io";
import {Events}         from "../../../lib/constants/events";
import {LobbyService}   from "./lobby.service";
import {GameWorld}      from "../../../lib/entities/game-world";
import {PresenceClient} from "../presence/presence.client";

@WebSocketGateway()
export class LobbyGateway implements OnGatewayConnection, OnGatewayInit {
    @WebSocketServer()
    server: Server;
    socket: Socket;

    servers: GameWorld[] = [];

    presence: PresenceClient;


    constructor(private service: LobbyService) {

    }

    async handleConnection(client: Socket, ...args: any[]) {
        try {
            await this.service.getAccount(client);
            this.updateServerList(this.servers);
        } catch (e) {
            client.emit('connect-error', 'Not Authorized');
            client.disconnect(true);
        }
    }


    afterInit(server: Server): any {
        this.presence = new PresenceClient();
        this.presence.serverList$.subscribe(data => this.updateServerList(data));
    }

    private updateServerList(data) {
        this.servers = data;
        this.server.emit(Events.SERVER_LIST, data);
    }
}
