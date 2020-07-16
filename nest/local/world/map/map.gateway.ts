import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import {
    AllNpcs,
    AllPlayers,
    ChangeMapChannel,
    GetMapChannels,
    PlayerAttemptedTransition,
    PlayerDirections,
    PlayerEnteredMap,
    PlayerLeftMap
}                                                              from '../../../../shared/actions/map.actions'
import { WorldService }                                        from '../world.service'
import { WorldConstants }                                      from '../../../lib/constants/world.constants'
import { Repository }                                          from 'typeorm'
import { Player }                                              from '../entities/player'
import { InjectRepository }                                    from '@nestjs/typeorm'
import { Namespace, Socket }                                   from 'socket.io'
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
            if (player) {
                if (this.server.sockets[player.socketId]) {
                    player.channel = data.channel
                    player.map     = data.map
                    this.server.sockets[player.socketId].join('map.' + data.map + '.' + player.channel)
                    let npcs = await this.map.getAllNpcs(data.map, player.channel)
                    this.server.sockets[player.socketId].emit(AllPlayers.type, new AllPlayers(data.map, await this.map.getAllPlayers(data.map, player.channel)))
                    this.server.sockets[player.socketId].emit(AllNpcs.type, new AllNpcs(data.map, npcs))
                    await this.players.save(player)
                }
                this.server.to('map.' + data.map + '.' + data.channel).emit(PlayerEnteredMap.type, data)
            }
        }
    }

    async playerLeave(data: PlayerLeftMap) {
        if (!this.service.shuttingDown) {
            const player = await this.players.findOne({ characterId: data.id })
            if (player) {
                if (this.server.sockets[player.socketId]) {
                    this.server.sockets[player.socketId].leave('map.' + data.map + '.' + data.channel)
                }
                this.server.to('map.' + data.map + '.' + data.channel).emit(PlayerLeftMap.type, data)
            }
        }
    }


    @SubscribeMessage(PlayerDirections.type)
    async playerDirectionalInput(client: Socket, data: { directions: { up: boolean, down: boolean, left: boolean, right: boolean } }) {
        if (!this.service.shuttingDown) {
            await this.service.playerDirectionalInput(client, data)
        }
    }

    @SubscribeMessage(PlayerAttemptedTransition.type)
    async playerAttemptedTransition(client: Socket) {
        return await this.service.playerAttemptedTransition(client)
    }

    @SubscribeMessage(ChangeMapChannel.type)
    async changeInstance(client: Socket, channel: number) {
        if (!this.service.shuttingDown) {
            return await this.service.changeInstance(client, channel)
        }
        return false
    }

    @SubscribeMessage(GetMapChannels.type)
    async getChannels(client: Socket, data: GetMapChannels) {
        return await this.service.getChannels(client, data)
    }

}
