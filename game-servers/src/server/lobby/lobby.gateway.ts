import {
    OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit,
    WebSocketGateway,
    WebSocketServer
}                       from "@nestjs/websockets";
import {Server, Socket} from "socket.io";
import {LobbyService}   from "./lobby.service";
import {GameWorld}      from "../../../lib/entities/game-world";
import {Events}         from "../../../lib/constants/events";
import {Logger}         from "@nestjs/common";

@WebSocketGateway()
export class LobbyGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    @WebSocketServer()
    server: Server;
    socket: Socket;
    servers: GameWorld[] = [];

    accounts: { [socketId: string]: { id: number, email: string } } = {};

    constructor(
        private logger: Logger,
        private service: LobbyService
    ) {

    }

    async handleConnection(client: Socket) {
        try {
            this.accounts[client.id] = await this.service.getAccount(client);
            client.emit(Events.SERVER_LIST, this.servers);
            this.logger.log(this.accounts[client.id].email + ' connected.');
        } catch (e) {
            this.logger.log(client.id + ' was not authorized, disconnecting socket.');
            client.emit('connect-error', 'Not Authorized');
            client.disconnect(true);
        }
    }

    async handleDisconnect(client: Socket) {
        if (this.accounts.hasOwnProperty(client.id)) {
            this.logger.log(this.accounts[client.id].email + ' disconnected.');
            delete this.accounts[client.id];
        }
    }

    async afterInit(server: Server) {
        this.servers = await this.service.getServers();
        this.server.emit(Events.SERVER_LIST, this.servers);
    }
}
