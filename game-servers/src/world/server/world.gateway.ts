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
    CharacterGetAll,
    CharacterNotCreated,
    CharacterOffline,
    CharacterOnline
}                                                         from "../../global/character/actions";

@WebSocketGateway()
export class WorldGateway implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection, OnApplicationShutdown {
    @WebSocketServer()
    server: Server;
    capacity                                                                                            = 100;
    accounts: { [id: number]: { id: number, email: string, socketId: string, character: {id:number, name:string} } }      = {};
    sockets: { [socketId: string]: { id: number, email: string, socketId: string, character: {id:number, name:string} } } = {};

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

    async handleConnection(client: Socket, ...args: any[]) {
        try {
            if (this.service.users.length >= this.capacity) {
                throw new Error("User Capacity Reached");
            }
            let user = await this.service.verifyUser(client);
            if (this.accounts[user.id]) {
                throw new ConflictException("User already logged in!");
            }
            this.accounts[user.id]  = {...user, socketId: client.id, character: null};
            this.sockets[client.id] = this.accounts[user.id];
            client.emit(CharacterGetAll.event, await this.service.getCharacters(user.id));
        } catch (e) {
            client.emit("connect-error", e.message);
            client.disconnect(true);
        }
    }

    @SubscribeMessage(CharacterCreate.event)
    async createCharacter(client: Socket, data: { name: string, gender: 'male' | 'female' }) {
        try {
            let accountId            = this.sockets[client.id].id;
            let character: Character = await this.service.createCharacter(accountId, data.name, data.gender);
            if (character) {
                client.emit(CharacterGetAll.event, await this.service.getCharacters(accountId));
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
    async characterJoined(client: Socket, character:{id:number, name:string}) {
        try {
            let user = this.sockets[client.id];
            this.character.characterOnline(character.id);
            user.character = character;
            client.join('character.' + character.name);
            return {status: 'success'};
        } catch (e) {
            this.logger.error(e);
            return {status: 'error'};
        }
    }

    @SubscribeMessage(CharacterOffline.event)
    async characterLeft(client: Socket) {
        try {
            let user              = this.sockets[client.id];
            let previousCharacter = user.character;
            this.character.characterOffline(previousCharacter.id);
            user.character = null;
            client.leave('character.' + previousCharacter.name);
            return {status: 'success'};
        } catch (e) {
            this.logger.error(e);
            return {status: 'error'};
        }
    }

    async handleDisconnect(client: Socket) {
        try {
            let user = this.sockets[client.id];
            if (user.character !== null) {
                this.character.characterOffline(user.character.id);
            }
            delete this.accounts[user.id];
            delete this.sockets[client.id];
        } catch (e) {
            this.logger.error(e);
        }
    }

    async onApplicationShutdown(signal?: string) {
        this.character.allCharactersOffline(Object.keys(this.accounts).map(key => (new CharacterOffline(
            this.accounts[key].character.id
        ))));
        this.presence.serverOffline(this.serverId);
    }
}
