import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit, SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
}                                      from "@nestjs/websockets";
import {Server, Socket}                from "socket.io";
import {WorldService}                  from "./world.service";
import {Logger, OnApplicationShutdown} from "@nestjs/common";
import {PresenceClient}                from "../../global/presence/client/presence.client";
import {config}                        from "../../lib/config";
import {WorldConstants}                from "../constants";
import {CharacterClient}               from "../../global/character/client/character.client";
import {
    CreateCharacter,
    CharacterOffline,
    CharacterOnline
}                                      from "../../global/character/actions";
import {from}                          from "rxjs";
import {WorldWebsocket}                from "./world-websocket";
import {WorldWebsocketService}         from "./world-websocket.service";

@WebSocketGateway({namespace: 'world', pingInterval: 5000, pingTimeout: 10000})
export class WorldGateway implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection, OnApplicationShutdown {
    @WebSocketServer()
    server: Server;
    serverId = null;

    constructor(
        private logger: Logger,
        private service: WorldService,
        private presence: PresenceClient,
        private character: CharacterClient
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

    async handleConnection(client: WorldWebsocket, ...args: any[]) {
        client.service = new WorldWebsocketService(this.server, client, this.service);
        await client.service.authenticate();
    }

    @SubscribeMessage(CreateCharacter.event)
    async createCharacter(client: WorldWebsocket, data: { name: string, gender: 'male' | 'female' }) {
        return {
            character: await client.service.createCharacter(data)
        };
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
