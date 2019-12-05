import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    WebSocketGateway,
    WebSocketServer
}                                                         from "@nestjs/websockets";
import {WorldService}                                     from "./world.service";
import {ConflictException, Logger, OnApplicationShutdown} from "@nestjs/common";
import {PresenceClient}                                   from "../presence/client/presence.client";
import {environment}                                      from "../../lib/config/environment";
import {WorldConstants}                  from "../../lib/constants/world.constants";
import {CharacterClient}                 from "../character/client/character.client";
import {CharacterOffline, GetCharacters} from "../character/actions";
import {InjectRepository}                from "@nestjs/typeorm";
import {Player}                          from "./entities/player";
import {createConnection, Repository}    from "typeorm";
import * as fs                           from "fs";
import * as path                         from "path";
import {Namespace, Socket}               from "socket.io";
import * as parser from "socket.io-msgpack-parser";

@WebSocketGateway({
    namespace   : 'world',
    pingInterval: WorldConstants.PING_INTERVAL,
    pingTimeout : WorldConstants.PING_TIMEOUT,
    parser
})
export class WorldGateway implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection, OnApplicationShutdown {
    @WebSocketServer()
    server: Namespace;
    serverId = null;

    constructor(
        @InjectRepository(Player)
        private players: Repository<Player>,
        private logger: Logger,
        private service: WorldService,
        private presence: PresenceClient,
        private character: CharacterClient
    ) {

    }

    async afterInit(server: Namespace) {
        this.serverId = await this.presence.register(
            environment.servers.world.host,
            environment.servers.world.port,
            WorldConstants.CONSTANT,
            WorldConstants.NAME,
            parseInt(process.env.NODE_APP_INSTANCE)
        );
    }

    async handleConnection(client: Socket, ...args: any[]) {
        try {
            if ((await this.players.count()) >= 100) {
                throw new Error("Server Limit Reached");
            }
            let user   = await this.service.authenticate(client);
            let player = await this.players.findOne({accountId: user.id});
            if (player) {
                throw new ConflictException("User already logged in!");
            }
            await this.service.storeUser(client, user.id);
            client.emit(GetCharacters.event, await this.service.getCharacters(user.id));
        } catch (e) {
            console.log(e);
            client.emit("connect-error", e.message);
            client.disconnect(true);
        }
    }

    async handleDisconnect(client: Socket) {
        try {
            await this.service.removePlayer(client);
        } catch (e) {
            this.logger.error(e);
        }
    }

    async onApplicationShutdown(signal?: string) {
        let connection = await createConnection({
            type    : 'sqlite',
            database: path.resolve(environment.dbRoot, WorldConstants.DB_NAME + process.env.NODE_APP_INSTANCE + '.db'),
            logging : false
        });
        let players    = await connection.query('select characterId from player');
        this.character.allCharactersOffline(players.map(player => (new CharacterOffline(player.characterId)))).then();
        this.presence.serverOffline(this.serverId).then();
        await connection.close();
        fs.unlinkSync(path.resolve(environment.dbRoot, WorldConstants.DB_NAME + process.env.NODE_APP_INSTANCE + '.db'));
    }
}
