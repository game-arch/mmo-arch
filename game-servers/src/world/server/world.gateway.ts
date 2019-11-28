import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit, SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
}                                                         from "@nestjs/websockets";
import {Server, Socket}                                   from "socket.io";
import {WorldService}                                     from "./world.service";
import {ConflictException, Logger, OnApplicationShutdown} from "@nestjs/common";
import {PresenceClient}                                   from "../../global/presence/client/presence.client";
import {config}                                           from "../../lib/config";
import {ClientProxy}                                      from "@nestjs/microservices";
import {Character}                                        from "../../global/character/entities/character";
import {WorldConstants}                                   from "../constants";
import {CharacterClient}                                  from "../../global/character/client/character.client";
import {
    CharacterCreate,
    CharacterCreated,
    GetCharacters,
    CharacterNotCreated,
    CharacterOffline,
    CharacterOnline
}                                                         from "../../global/character/actions";
import {from}                                             from "rxjs";

@WebSocketGateway({namespace: 'world'})
export class WorldGateway implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection, OnApplicationShutdown {
    @WebSocketServer()
    server: Server;
    capacity = 100;

    serverId = null;

    constructor(
        private logger: Logger,
        private service: WorldService,
        private presence: PresenceClient,
        private character: CharacterClient,
        private client: ClientProxy
    ) {

    }

    async afterInit(server: Server) {
        this.serverId = await this.presence.register(
            config.servers.world.host,
            config.servers.world.port,
            WorldConstants.CONSTANT,
            WorldConstants.NAME,
            parseInt(process.env.NODE_APP_INSTANCE)
        );
    }

    async sendCharacters() {
        await from(Object.keys(this.service.characters))
            .subscribe(id => {
                this.character.characterOnline(parseInt(id));
            });
    }

    async handleConnection(client: Socket, ...args: any[]) {
        try {
            if (Object.keys(this.service.accounts).length >= this.capacity) {
                throw new Error("Server Limit Reached");
            }
            let user = await this.service.verifyUser(client);
            if (this.service.accounts[user.id]) {
                throw new ConflictException("User already logged in!");
            }
            this.service.storeUser(client, user.id);
            client.emit(GetCharacters.event, await this.service.getCharacters(user.id));
        } catch (e) {
            client.emit("connect-error", e.message);
            client.disconnect(true);
        }
    }

    @SubscribeMessage(CharacterCreate.event)
    async createCharacter(client: Socket, data: { name: string, gender: 'male' | 'female' }) {
        try {
            let accountId            = this.service.sockets[client.id].accountId;
            let character: Character = await this.service.createCharacter(accountId, data.name, data.gender);
            if (character) {
                client.emit(GetCharacters.event, await this.service.getCharacters(accountId));
                client.emit(CharacterCreated.event, new CharacterCreated(character.accountId, character.world, character.id));
                this.client.emit(CharacterCreated.event, new CharacterCreated(character.accountId, character.world, character.id));
                return {status: 'success'};
            }
            client.emit(CharacterNotCreated.event);
            return {status: 'error'};
        } catch (e) {
            client.emit(CharacterNotCreated.event, new CharacterNotCreated(e.response));
            return {status: 'error'};
        }
    }

    @SubscribeMessage(CharacterOnline.event)
    async characterJoined(client: Socket, character: { id: number, name: string }) {
        try {
            await this.service.storeCharacter(client, character);
            return {status: 'success'};
        } catch (e) {
            this.logger.error(e);
            return {status: 'error'};
        }
    }

    @SubscribeMessage(CharacterOffline.event)
    async characterLeft(client: Socket) {
        try {
            this.service.removeCharacter(client);
            return {status: 'success'};
        } catch (e) {
            this.logger.error(e);
            return {status: 'error'};
        }
    }

    async handleDisconnect(client: Socket) {
        try {
            this.service.removePlayer(client);
        } catch (e) {
            this.logger.error(e);
        }
    }

    async onApplicationShutdown(signal?: string) {
        this.character.allCharactersOffline(Object.keys(this.service.characters).map(id => (new CharacterOffline(parseInt(id)))));
        this.presence.serverOffline(this.serverId);
    }
}
