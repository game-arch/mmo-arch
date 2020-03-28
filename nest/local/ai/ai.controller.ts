import { Controller, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common'
import { AiService }                                                 from './ai.service'
import { MapOnline, NpcUpdate, PlayerUpdate }                        from '../map/actions'
import { EventPattern }                                              from '@nestjs/microservices'
import { WORLD_PREFIX }                                              from '../world/world.prefix'
import { from }                                                      from 'rxjs'

@Controller()
export class AiController implements OnApplicationBootstrap, OnApplicationShutdown {

    constructor(private service: AiService) {
    }

    @EventPattern(WORLD_PREFIX + MapOnline.event)
    onMapOnline(data: MapOnline) {
        from(this.service.npcAddedCallbacks)
            .subscribe(callback => callback(data.map))
    }

    @EventPattern(WORLD_PREFIX + NpcUpdate.event)
    onNpcUpdate(data: NpcUpdate) {
        this.service.onNpcUpdate.next(data.npc)
    }

    @EventPattern(WORLD_PREFIX + PlayerUpdate.event)
    onPlayerUpdate(data: PlayerUpdate) {
        this.service.onPlayerUpdate.next(data.player)
    }

    onApplicationBootstrap() {
        this.service.start()
    }

    onApplicationShutdown(signal?: string) {
        this.service.stop()
    }
}
