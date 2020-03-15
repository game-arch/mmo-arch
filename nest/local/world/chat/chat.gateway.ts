import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { WorldConstants }                                      from '../../../lib/constants/world.constants'
import { GameCharacter }                                       from '../../../../shared/interfaces/game-character'
import {
    ErrorMessage,
    GlobalMessage,
    LocalMessage,
    PrivateMessage,
    RegionMessage,
    TradeMessage,
    ZoneMessage
}                                                              from './actions'
import { MapClient }                                           from '../../map/client/map.client'
import { WorldService }                                        from '../world.service'
import { ClientProxy }                                         from '@nestjs/microservices'
import { Inject }                                              from '@nestjs/common'
import { WORLD_PREFIX }                                        from '../world.prefix'
import { InjectRepository }                                    from '@nestjs/typeorm'
import { Player }                                              from '../entities/player'
import { Repository }                                          from 'typeorm'
import {
    Namespace,
    Socket
}                                                              from 'socket.io'
import * as parser                                             from 'socket.io-msgpack-parser'
import { LOCAL_CLIENT }                                        from '../../../client/client.module'

@WebSocketGateway({
    namespace   : 'world',
    pingInterval: WorldConstants.PING_INTERVAL,
    pingTimeout : WorldConstants.PING_TIMEOUT,
    parser
})
export class ChatGateway {
    @WebSocketServer()
    server: Namespace


    constructor(
        @InjectRepository(Player)
        private players: Repository<Player>,
        @Inject(LOCAL_CLIENT) private client: ClientProxy,
        private world: WorldService,
        private map: MapClient
    ) {

    }

    @SubscribeMessage(WORLD_PREFIX + LocalMessage.event)
    async localMessage(client: Socket, message: string) {
        const player = await this.players.findOne({ socketId: client.id })
        if (player && player.characterId !== null) {
            const map = this.world.getMapOf(client)
            if (map !== '') {
                const position = await this.map.getPlayer(player.characterId, map)
                this.client.emit(WORLD_PREFIX + LocalMessage.event, new LocalMessage(player.character, map, position.x, position.y, message))
            }
        }
    }

    @SubscribeMessage(WORLD_PREFIX + ZoneMessage.event)
    async zoneMessage(client: Socket, message: string) {
        const player = await this.players.findOne({ socketId: client.id })
        if (player && player.characterId !== null) {
            const map = this.world.getMapOf(client)
            if (map !== '') {
                this.client.emit(WORLD_PREFIX + ZoneMessage.event, new ZoneMessage(player.character, map, message))
            }
        }
    }

    @SubscribeMessage(WORLD_PREFIX + RegionMessage.event)
    async regionMessage(client: Socket, message: string) {
        const player = await this.players.findOne({ socketId: client.id })
        if (player && player.characterId !== null) {
            const map = this.world.getMapOf(client)
            if (map !== '') {
                this.client.emit(WORLD_PREFIX + RegionMessage.event, new ZoneMessage(player.character, map, message))
            }
        }
    }

    @SubscribeMessage(WORLD_PREFIX + TradeMessage.event)
    async tradeMessage(client: Socket, message: string) {
        const player = await this.players.findOne({ socketId: client.id })
        if (player && player.characterId !== null) {
            const map = this.world.getMapOf(client)
            if (map !== '') {
                this.client.emit(WORLD_PREFIX + TradeMessage.event, new TradeMessage(player.character, message))
            }
        }
    }

    @SubscribeMessage(WORLD_PREFIX + GlobalMessage.event)
    async globalMessage(client: Socket, message: string) {
        const player = await this.players.findOne({ socketId: client.id })
        if (player && player.characterId !== null) {
            const map = this.world.getMapOf(client)
            if (map !== '') {
                this.client.emit(WORLD_PREFIX + GlobalMessage.event, new GlobalMessage(player.character, message))
            }
        }
    }

    @SubscribeMessage(WORLD_PREFIX + PrivateMessage.event)
    async privateMessage(client: Socket, data: { to: GameCharacter, message: string }) {
        const player = await this.players.findOne({ socketId: client.id })
        if (player && player.characterId !== null) {
            const map = this.world.getMapOf(client)
            if (map !== '') {
                let sent = false
                this.client.emit(WORLD_PREFIX + PrivateMessage.event, new PrivateMessage(player.character, data.to, data.message))
                    .subscribe({
                        next(delivered) {
                            if (delivered) {
                                sent = true
                            }
                        },
                        complete() {
                            if (!sent) {
                                client.emit(ErrorMessage.event, new ErrorMessage('Could not send private message to the specified user at this time.'))
                            }
                        }
                    })
            }
        }
    }
}
