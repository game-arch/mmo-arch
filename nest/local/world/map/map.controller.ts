import { Controller }                                               from '@nestjs/common'
import { EventPattern }                                             from '@nestjs/microservices'
import { NpcUpdate, PlayerEnteredMap, PlayerLeftMap, PlayerUpdate } from '../../../../shared/actions/map.actions'
import { MapGateway }                                               from './map.gateway'
import { WorldEvent }                                               from '../../../lib/event.types'

@Controller()
export class MapController {


    constructor(
        private gateway: MapGateway
    ) {
    }

    @EventPattern(new WorldEvent(PlayerEnteredMap.type))
    async onMapJoined(data: PlayerEnteredMap) {
        await this.gateway.playerJoin(data)
    }

    @EventPattern(new WorldEvent(PlayerLeftMap.type))
    async onMapLeft(data: PlayerLeftMap) {
        await this.gateway.playerLeave(data)
    }

    @EventPattern(new WorldEvent(PlayerUpdate.type))
    playerUpdate(data: PlayerUpdate) {
        this.gateway.server.to('map.' + data.map + '.' + data.channel).emit(PlayerUpdate.type, data)
    }

    @EventPattern(new WorldEvent(NpcUpdate.type))
    npcUpdate(data: NpcUpdate) {
        this.gateway.server.to('map.' + data.map + '.' + data.channel).emit(NpcUpdate.type, data)
    }
}
