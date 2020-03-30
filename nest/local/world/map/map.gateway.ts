import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import {
    AllNpcs,
    AllPlayers,
    PlayerAttemptedTransition,
    PlayerDirectionalInput,
    PlayerEnteredMap,
    PlayerLeftMap
}                                                              from '../../../../shared/events/map.events'
import { WorldService }                                        from '../world.service'
import { WorldConstants }                                      from '../../../lib/constants/world.constants'
import { Repository }                                          from 'typeorm'
import { Player }                                              from '../entities/player'
import { InjectRepository }                                    from '@nestjs/typeorm'
import {
    Namespace,
    Socket
}                                                              from 'socket.io'
import { MapClient }                                           from '../../map/client/map.client'
import * as parser                                             from 'socket.io-msgpack-parser'

@WebSocketGateway({
    namespace   : 'world',
    pingInterval: WorldConstants.PING_INTERVAL,
    pingTimeout : WorldConstants.PING_TIMEOUT,
    parser
})
export class MapGateway {
    @WebSocketServer()
    server: Namespace

    constructor(
        @InjectRepository(Player)
        private players: Repository<Player>,
        private service: WorldService,
        private map: MapClient
    ) {

    }

    async playerJoin(data: PlayerEnteredMap) {
        if (!this.service.shuttingDown) {
            const player = await this.players.findOne({ characterId: data.instanceId })
            if (player && this.server.sockets[player.socketId]) {
                this.server.sockets[player.socketId].join('map.' + data.map)
                this.server.sockets[player.socketId].emit(AllPlayers.event, new AllPlayers(data.map, await this.map.getAllPlayers(data.map)))
                this.server.sockets[player.socketId].emit(AllNpcs.event, new AllNpcs(data.map, await this.map.getAllNpcs(data.map)))
            }
            this.server.to('map.' + data.map).emit(PlayerEnteredMap.event, data)
        }
    }

    async playerLeave(data: PlayerLeftMap) {
        if (!this.service.shuttingDown) {
            this.server.to('map.' + data.map).emit(PlayerLeftMap.event, data)
            const player = await this.players.findOne({ characterId: data.id })
            if (player && this.server.sockets[player.socketId]) {
                this.server.sockets[player.socketId].leave('map.' + data.map)
            }
        }
    }

    allPlayers(data: AllPlayers) {
        if (!this.service.shuttingDown) {
            this.server.to('map.' + data.map).emit(AllPlayers.event, data)
        }
    }


    @SubscribeMessage(PlayerDirectionalInput.event)
    async playerDirectionalInput(client: Socket, data: { directions: { up: boolean, down: boolean, left: boolean, right: boolean } }) {
        if (!this.service.shuttingDown) {
            await this.service.playerDirectionalInput(client, data)
        }
    }

    @SubscribeMessage(PlayerAttemptedTransition.event)
    async playerAttemptedTransition(client: Socket) {
        if (!this.service.shuttingDown) {
            await this.service.playerAttemptedTransition(client)
        }
    }
}
