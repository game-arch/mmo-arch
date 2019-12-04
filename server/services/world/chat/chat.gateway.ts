import {SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import {WorldConstants}                                      from "../../../lib/constants/world.constants";
import {GameCharacter}                                       from "../../../lib/interfaces/game-character";
import {
    ErrorMessage,
    GlobalMessage,
    LocalMessage,
    PrivateMessage,
    RegionMessage,
    TradeMessage,
    ZoneMessage
}                                                            from "./actions";
import {MapClient}                                           from "../../map/client/map.client";
import {WorldService}                                        from "../world.service";
import {ClientProxy}                                         from "@nestjs/microservices";
import {Inject}                                              from "@nestjs/common";
import {WORLD_PREFIX}                                        from "../world.prefix";
import {RedisNamespace}                                      from "../redis.namespace";
import {RedisSocket}                                         from "../redis.socket";
import {InjectRepository}                                    from "@nestjs/typeorm";
import {Player}                                              from "../entities/player";
import {Repository}                                          from "typeorm";

@WebSocketGateway({
    namespace   : 'world',
    pingInterval: WorldConstants.PING_INTERVAL,
    pingTimeout : WorldConstants.PING_TIMEOUT
})
export class ChatGateway {
    @WebSocketServer()
    server: RedisNamespace;


    constructor(
        @InjectRepository(Player)
        private players: Repository<Player>,
        @Inject('WORLD_CLIENT') private client: ClientProxy,
        private world: WorldService,
        private map: MapClient
    ) {

    }

    @SubscribeMessage(WORLD_PREFIX + LocalMessage.event)
    async localMessage(client: RedisSocket, message: string) {
        let player = await this.players.findOne({socketId: client.id});
        if (player && player.characterId !== null) {
            let map = this.world.getMapOf(client);
            if (map !== '') {
                let position = await this.map.getPlayer(player.characterId, map);
                this.client.emit(WORLD_PREFIX + LocalMessage.event, new LocalMessage(player.character, map, position.x, position.y, message));
            }
        }
    }

    @SubscribeMessage(WORLD_PREFIX + ZoneMessage.event)
    async zoneMessage(client: RedisSocket, message: string) {
        let player = await this.players.findOne({socketId: client.id});
        if (player && player.characterId !== null) {
            let map = this.world.getMapOf(client);
            if (map !== '') {
                this.client.emit(WORLD_PREFIX + ZoneMessage.event, new ZoneMessage(player.character, map, message));
            }
        }
    }

    @SubscribeMessage(WORLD_PREFIX + RegionMessage.event)
    async regionMessage(client: RedisSocket, message: string) {
        let player = await this.players.findOne({socketId: client.id});
        if (player && player.characterId !== null) {
            let map = this.world.getMapOf(client);
            if (map !== '') {
                this.client.emit(WORLD_PREFIX + RegionMessage.event, new ZoneMessage(player.character, map, message));
            }
        }
    }

    @SubscribeMessage(WORLD_PREFIX + TradeMessage.event)
    async tradeMessage(client: RedisSocket, message: string) {
        let player = await this.players.findOne({socketId: client.id});
        if (player && player.characterId !== null) {
            let map = this.world.getMapOf(client);
            if (map !== '') {
                this.client.emit(WORLD_PREFIX + TradeMessage.event, new TradeMessage(player.character, message));
            }
        }
    }

    @SubscribeMessage(WORLD_PREFIX + GlobalMessage.event)
    async globalMessage(client: RedisSocket, message: string) {
        let player = await this.players.findOne({socketId: client.id});
        if (player && player.characterId !== null) {
            let map = this.world.getMapOf(client);
            if (map !== '') {
                this.client.emit(WORLD_PREFIX + GlobalMessage.event, new GlobalMessage(player.character, message));
            }
        }
    }

    @SubscribeMessage(WORLD_PREFIX + PrivateMessage.event)
    async privateMessage(client: RedisSocket, data: { to: GameCharacter, message: string }) {
        let player = await this.players.findOne({socketId: client.id});
        if (player && player.characterId !== null) {
            let map = this.world.getMapOf(client);
            if (map !== '') {
                let sent = false;
                this.client.emit(WORLD_PREFIX + PrivateMessage.event, new PrivateMessage(player.character, data.to, data.message))
                    .subscribe({
                        next(delivered) {
                            if (delivered) {
                                sent = true;
                            }
                        },
                        complete() {
                            if (!sent) {
                                client.emit(ErrorMessage.event, new ErrorMessage('Could not send private message to the specified user at this time.'));
                            }
                        }
                    });
            }
        }
    }
}
