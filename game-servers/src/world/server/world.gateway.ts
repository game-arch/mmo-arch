import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
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
import {CharacterOffline}              from "../../global/character/actions";
import {WorldWebsocket}                from "./world-websocket";
import {WorldWebsocketService}         from "./world-websocket.service";

@WebSocketGateway({
    namespace   : 'world',
    pingInterval: WorldConstants.PING_INTERVAL,
    pingTimeout : WorldConstants.PING_TIMEOUT
})
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

    async handleConnection(client: WorldWebsocket, ...args: any[]) {
        client.service = new WorldWebsocketService(this.server, client, this.service);
        await client.service.authenticate();
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
