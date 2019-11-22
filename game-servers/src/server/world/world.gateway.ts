import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit, SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
}                          from "@nestjs/websockets";
import {Server, Socket}    from "socket.io";
import {WorldService}      from "./world.service";
import {Events}            from "../../../lib/constants/events";
import {CharacterEvents}   from "../../microservice/character/character.events";
import {ConflictException} from "@nestjs/common";
import {PresenceClient}    from "../../microservice/presence/client/presence.client";
import {config}            from "../../lib/config";

@WebSocketGateway()
export class WorldGateway implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection {
    @WebSocketServer()
    server: Server;

    capacity = 100;

    name = process.env.WORLD_NAME || 'Maiden';

    instanceId = parseInt(process.env.NODE_APP_INSTANCE);

    accounts: number[] = [];

    serverId = null;

    constructor(private service: WorldService, private presence: PresenceClient) {

    }

    async afterInit(server: Server) {
        this.serverId = await this.presence.register(
            config.servers.world.host,
            config.servers.world.port,
            process.env.WORLD_NAME || 'Maiden',
            parseInt(process.env.NODE_APP_INSTANCE)
        );
    }

    async handleConnection(client: Socket, ...args: any[]) {
        try {
            if (this.service.users.length >= this.capacity) {
                throw new Error("User Capacity Reached");
            }
            let user = await this.service.verifyUser(client);
            if (this.accounts.indexOf(user.id) !== -1) {
                throw new ConflictException("User already logged in!");
            }
            this.accounts.push(user.id);
            await this.presence.userOnline(this.serverId, user.id);
            client.emit(Events.CHARACTER_LIST, await this.service.getCharacters(client));
        } catch (e) {
            client.emit("connection-error", e.message);
            client.disconnect(true);
        }
    }

    @SubscribeMessage(CharacterEvents.CREATE)
    async createCharacter(client: Socket, data: { name: string, gender: 'male' | 'female' }) {
        try {
            let character = await this.service.createCharacter(client, data.name, data.gender);
            if (character) {
                client.emit(Events.CHARACTER_LIST, await this.service.getCharacters(client));
                client.emit(Events.CHARACTER_CREATED, character);
                return;
            }
            client.emit(Events.CHARACTER_NOT_CREATED);
        } catch (e) {
            client.emit(Events.CHARACTER_NOT_CREATED, e.response);
        }
    }

    @SubscribeMessage(Events.CHARACTER_ONLINE)
    async characterJoined(client: Socket, character: { name: string }) {
        try {
            let user = await this.service.getUser(client);
            await this.presence.characterOnline(user.id, character.name);
        } catch (e) {
            console.error(e);
        }
    }

    @SubscribeMessage(Events.CHARACTER_OFFLINE)
    async characterLeft(client: Socket) {
        try {
            let user = await this.service.getUser(client);
            await this.presence.characterOffline(user.id);
        } catch (e) {
            console.error(e);
        }
    }

    async handleDisconnect(client: Socket) {
        try {
            let user = await this.service.getUser(client);
            if (this.accounts.indexOf(user.id) !== -1) {
                this.accounts.splice(this.accounts.indexOf(user.id), 1);
            }
            await this.presence.userOffline(this.serverId, user.id);
        } catch (e) {
            console.error(e);
        }
    }
}
