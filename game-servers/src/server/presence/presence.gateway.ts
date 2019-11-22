import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
}                               from "@nestjs/websockets";
import {Server, Socket}         from "socket.io";
import {PresenceService}        from "./presence.service";
import {OnApplicationBootstrap} from "@nestjs/common";
import {Events}                 from "../../../lib/constants/events";
import {config}                 from "../../lib/config";

@WebSocketGateway()
export class PresenceGateway implements OnGatewayConnection, OnGatewayDisconnect, OnApplicationBootstrap {
    @WebSocketServer()
    server: Server;

    constructor(private service: PresenceService) {
    }

    async handleConnection(client: Socket, ...args: any[]) {
        if (Boolean(client.handshake.query.name)) {
            let name       = client.handshake.query.name;
            let port       = parseInt(client.handshake.query.port || config.servers.world.port);
            let instanceId = parseInt(client.handshake.query.instanceId || '1');
            await this.service.online(client.id, this.service.getHost(client.handshake.address), port, instanceId, name);
            return;
        }

        client.emit(Events.SERVER_LIST, this.service.getServers());
    }

    @SubscribeMessage(Events.USER_CONNECTED)
    async onUserConnection(client: Socket, data: { accountId: number, world: string }) {
        await this.service.addUser(client.id, data);
        this.server.emit(Events.USER_CONNECTED, data);
    }

    @SubscribeMessage(Events.USER_DISCONNECTED)
    async onUserDisconnection(client: Socket, data: { accountId: number, world: string }) {
        await this.service.removeUser(client.id, data);
        this.server.emit(Events.USER_DISCONNECTED, data);
    }

    @SubscribeMessage(Events.CHARACTER_JOINED)
    async onCharacterSelection(client: Socket, character: { accountId: number, name: string }) {
        await this.service.characterJoin(character);
        this.server.emit(Events.CHARACTER_JOINED, character.name);
    }

    @SubscribeMessage(Events.CHARACTER_LEFT)
    async onCharacterLeave(client: Socket, character: { accountId: number, name: string }) {
        await this.service.characterLeave(character);
        this.server.emit(Events.CHARACTER_LEFT, character.name);
    }

    async handleDisconnect(client: Socket) {
        await this.service.offline(client.id);
    }

    async onApplicationBootstrap() {
        this.service.sendServers.subscribe(() => {
            this.server.emit(Events.SERVER_LIST, this.service.getServers());
        })
    }


}
