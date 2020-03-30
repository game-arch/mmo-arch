import { Controller, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common'
import { AiService }                                                 from './ai.service'
import { NpcDistance }      from '../../../shared/interfaces/npc-distance'
import { PlayerChangedMap } from '../../../shared/events/map.events'
import { EventPattern }     from '@nestjs/microservices'
import { WORLD_PREFIX }       from '../world/world.prefix'
import { NpcDistanceChanged } from '../../../shared/events/distance.events'

@Controller()
export class AiController implements OnApplicationBootstrap, OnApplicationShutdown {

    constructor(private service: AiService) {
    }

    @EventPattern(WORLD_PREFIX + NpcDistanceChanged.event)
    onDistanceChanged(data: NpcDistanceChanged) {
        this.service.onDistanceChange.next(data.data)
    }

    @EventPattern(WORLD_PREFIX + PlayerChangedMap.event)
    onPlayerChangedMap(data: PlayerChangedMap) {
        this.service.onPlayerChangedMap.next(data)
    }


    onApplicationBootstrap() {
        this.service.start()
    }

    onApplicationShutdown(signal?: string) {
        this.service.stop()
    }


}
