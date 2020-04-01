import { Controller }   from '@nestjs/common'
import { EventPattern } from '@nestjs/microservices'
import {
    ChangedMapChannel,
    NpcUpdate,
    PlayerEnteredMap,
    PlayerLeftMap,
    PlayerUpdate
}                       from '../../../../shared/events/map.events'
import { MapGateway }   from './map.gateway'
import { WORLD_PREFIX } from '../world.prefix'

@Controller()
export class MapController {


    constructor(
        private gateway: MapGateway
    ) {
    }

    @EventPattern(WORLD_PREFIX + PlayerEnteredMap.event)
    async onMapJoined(data: PlayerEnteredMap) {
        await this.gateway.playerJoin(data)
    }

    @EventPattern(WORLD_PREFIX + PlayerLeftMap.event)
    async onMapLeft(data: PlayerLeftMap) {
        await this.gateway.playerLeave(data)
    }

    @EventPattern(WORLD_PREFIX + ChangedMapChannel.event)
    async onChangedChannel(data: ChangedMapChannel) {
        await this.gateway.changedChannel(data)
    }

    @EventPattern(WORLD_PREFIX + PlayerUpdate.event)
    playerUpdate(data: PlayerUpdate) {
        this.gateway.server.to('map.' + data.map + '.' + data.channel).emit(PlayerUpdate.event, data)
    }

    @EventPattern(WORLD_PREFIX + NpcUpdate.event)
    npcUpdate(data: NpcUpdate) {
        this.gateway.server.to('map.' + data.map + '.' + data.channel).emit(NpcUpdate.event, data)
    }
}
