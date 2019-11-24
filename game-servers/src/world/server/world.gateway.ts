import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit, SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
}                                                         from "@nestjs/websockets";
import {Server, Socket}                                   from "socket.io";
import {WorldService}                                     from "./world.service";
import {Events}                                           from "../../../lib/constants/events";
import {CharacterEvents}                                  from "../character/character.events";
import {ConflictException, Logger, OnApplicationShutdown} from "@nestjs/common";
import {PresenceClient}                                   from "../../global/presence/client/presence.client";
import {config}                                           from "../../lib/config";
import {ClientProxy}                                      from "@nestjs/microservices";
import {Character}                                        from "../character/entities/character";
import {WorldConstants}                                   from "../constants";

@WebSocketGateway()
export class WorldGateway implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection, OnApplicationShutdown {
    @WebSocketServer()
    server: Server;
    capacity                                                                                            = 100;
    accounts: { [id: number]: { id: number, email: string, socketId: string, character: string } }      = {};
    sockets: { [socketId: string]: { id: number, email: string, socketId: string, character: string } } = {};

    serverId = null;

    constructor(
        private logger: Logger,
        private service: WorldService,
        private presence: PresenceClient,
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
            this.accounts[user.id]  = {...user, socketId: client.id, character: ''};
            this.sockets[client.id] = this.accounts[user.id];
            this.presence.userOnline(this.serverId, user.id);
            client.emit(Events.CHARACTER_LIST, await this.service.getCharacters(user.id));
        } catch (e) {
            client.emit("connect-error", e.message);
            client.disconnect(true);
        }
    }

    @SubscribeMessage(CharacterEvents.CREATE)
    async createCharacter(client: Socket, data: { name: string, gender: 'male' | 'female' }) {
        try {
            let accountId            = this.sockets[client.id].id;
            let character: Character = await this.service.createCharacter(accountId, data.name, data.gender);
            if (character) {
                client.emit(Events.CHARACTER_LIST, await this.service.getCharacters(accountId));
                client.emit(Events.CHARACTER_CREATED, character);
                this.client.emit(Events.CHARACTER_CREATED, {
                    accountId,
                    characterId: character.id,
                    world      : WorldConstants.CONSTANT
                });
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
            let user = this.sockets[client.id];
            this.presence.characterOnline(user.id, character.name);
            user.character = character.name;
            client.join('character.' + character.name);
        } catch (e) {
            this.logger.error(e);
        }
    }

    @SubscribeMessage(Events.CHARACTER_OFFLINE)
    async characterLeft(client: Socket) {
        try {
            let user              = this.sockets[client.id];
            let previousCharacter = user.character;
            this.presence.characterOffline(user.id);
            user.character = '';
            client.leave('character.' + previousCharacter);
        } catch (e) {
            this.logger.error(e);
        }
    }

    async handleDisconnect(client: Socket) {
        try {
            let user = await this.service.getUser(client);
            delete this.accounts[user.id];
            delete this.sockets[client.id];
            this.presence.userOffline(this.serverId, user.id);
        } catch (e) {
            this.logger.error(e);
        }
    }

    async onApplicationShutdown(signal?: string) {
        this.presence.serverOffline(this.serverId);
    }
}
