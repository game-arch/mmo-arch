import { Controller }                                               from '@nestjs/common'
import { EventPattern }                                             from '@nestjs/microservices'
import { NpcUpdate, PlayerEnteredMap, PlayerLeftMap, PlayerUpdate } from '../../../../shared/events/map.events'
import { MapGateway }                                               from './map.gateway'
import { WorldEvent }                                               from '../event.types'

@Controller()
export class MapController {


    constructor(
        private gateway: MapGateway
    ) {
    }

    @EventPattern(new WorldEvent(PlayerEnteredMap.event))
    async onMapJoined(data: PlayerEnteredMap) {
        await this.gateway.playerJoin(data)
    }

    @EventPattern(new WorldEvent(PlayerLeftMap.event))
    async onMapLeft(data: PlayerLeftMap) {
        await this.gateway.playerLeave(data)
    }

    @EventPattern(new WorldEvent(PlayerUpdate.event))
    playerUpdate(data: PlayerUpdate) {
        this.gateway.server.to('map.' + data.map + '.' + data.channel).emit(PlayerUpdate.event, data)
    }

    @EventPattern(new WorldEvent(NpcUpdate.event))
    npcUpdate(data: NpcUpdate) {
        this.gateway.server.to('map.' + data.map + '.' + data.channel).emit(NpcUpdate.event, data)
    }
}
