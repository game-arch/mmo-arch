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
import { InjectRepository }                                    from '@nestjs/typeorm'
import { Player }                                              from '../entities/player'
import { Repository }                                          from 'typeorm'
import {
    Namespace,
    Socket
}                                                              from 'socket.io'
import * as parser                                             from 'socket.io-msgpack-parser'
import { LOCAL_CLIENT } from '../../../client/client.module'
import { WorldEvent }   from '../../../lib/event.types'

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

    @SubscribeMessage(LocalMessage.event)
    async localMessage(client: Socket, message: string) {
        const player = await this.players.findOne({ socketId: client.id })
        if (player && player.characterId !== null) {
            const map = this.world.getMapOf(client)
            if (map !== '') {
                const position = await this.map.getPlayer(player.characterId, map, player.channel)
                this.client.emit(new WorldEvent(LocalMessage.event), new LocalMessage(player.character, map, player.channel, position.x, position.y, message))
            }
        }
    }

    @SubscribeMessage(ZoneMessage.event)
    async zoneMessage(client: Socket, message: string) {
        const player = await this.players.findOne({ socketId: client.id })
        if (player && player.characterId !== null) {
            const map = this.world.getMapOf(client)
            if (map !== '') {
                this.client.emit(new WorldEvent(ZoneMessage.event), new ZoneMessage(player.character, map, player.channel, message))
            }
        }
    }

    @SubscribeMessage(RegionMessage.event)
    async regionMessage(client: Socket, message: string) {
        const player = await this.players.findOne({ socketId: client.id })
        if (player && player.characterId !== null) {
            const map = this.world.getMapOf(client)
            if (map !== '') {
                this.client.emit(new WorldEvent(RegionMessage.event), new ZoneMessage(player.character, map, player.channel, message))
            }
        }
    }

    @SubscribeMessage(TradeMessage.event)
    async tradeMessage(client: Socket, message: string) {
        const player = await this.players.findOne({ socketId: client.id })
        if (player && player.characterId !== null) {
            const map = this.world.getMapOf(client)
            if (map !== '') {
                this.client.emit(new WorldEvent(TradeMessage.event), new TradeMessage(player.character, message))
            }
        }
    }

    @SubscribeMessage(GlobalMessage.event)
    async globalMessage(client: Socket, message: string) {
        const player = await this.players.findOne({ socketId: client.id })
        if (player && player.characterId !== null) {
            const map = this.world.getMapOf(client)
            if (map !== '') {
                this.client.emit(new WorldEvent(GlobalMessage.event), new GlobalMessage(player.character, message))
            }
        }
    }

    @SubscribeMessage(PrivateMessage.event)
    async privateMessage(client: Socket, data: { to: GameCharacter, message: string }) {
        const player = await this.players.findOne({ socketId: client.id })
        if (player && player.characterId !== null) {
            const map = this.world.getMapOf(client)
            if (map !== '') {
                let sent = false
                this.client.emit(new WorldEvent(PrivateMessage.event), new PrivateMessage(player.character, data.to, data.message))
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
