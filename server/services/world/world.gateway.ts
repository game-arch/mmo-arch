import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    WebSocketGateway,
    WebSocketServer
}                                                         from "@nestjs/websockets";
import {Server, Socket}                                   from "socket.io";
import {WorldService}                                     from "./world.service";
import {ConflictException, Logger, OnApplicationShutdown} from "@nestjs/common";
import {PresenceClient}                  from "../presence/client/presence.client";
import {environment}                     from "../../lib/config/environment";
import {WorldConstants}                  from "../../lib/constants/world.constants";
import {CharacterClient}                 from "../character/client/character.client";
import {CharacterOffline, GetCharacters} from "../character/actions";
import {RedisSocket}                     from "./redis.socket";
import {RedisNamespace}                  from "./redis.namespace";

@WebSocketGateway({
    namespace   : 'world',
    pingInterval: WorldConstants.PING_INTERVAL,
    pingTimeout : WorldConstants.PING_TIMEOUT
})
export class WorldGateway implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection, OnApplicationShutdown {
    @WebSocketServer()
    server: RedisNamespace;
    serverId = null;

    constructor(
        private logger: Logger,
        private service: WorldService,
        private presence: PresenceClient,
        private character: CharacterClient
    ) {

    }

    async afterInit(server: RedisNamespace) {
        this.serverId = await this.presence.register(
            environment.servers.world.host,
            environment.servers.world.port,
            WorldConstants.CONSTANT,
            WorldConstants.NAME,
            parseInt(process.env.NODE_APP_INSTANCE)
        );
    }

    async handleConnection(client: RedisSocket, ...args: any[]) {
        try {
            if (Object.keys(this.service.accounts).length >= 100) {
                throw new Error("Server Limit Reached");
            }
            let user = await this.service.authenticate(client);
            if (this.service.accounts[user.id]) {
                throw new ConflictException("User already logged in!");
            }
            this.service.storeUser(client, user.id);
            client.emit(GetCharacters.event, await this.service.getCharacters(user.id));
        } catch (e) {
            console.log(e);
            client.emit("connect-error", e.message);
            client.disconnect(true);
        }
    }

    async handleDisconnect(client: RedisSocket) {
        try {
            await this.service.removePlayer(client);
        } catch (e) {
            this.logger.error(e);
        }
    }

    async onApplicationShutdown(signal?: string) {
        this.character.allCharactersOffline(Object.keys(this.service.characters).map(id => (new CharacterOffline(parseInt(id)))));
        await this.presence.serverOffline(this.serverId);
    }
}
