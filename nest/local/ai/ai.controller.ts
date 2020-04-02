import { Controller, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common'
import { AiService }                                                 from './ai.service'
import { PlayerChangedMap }                                          from '../../../shared/events/map.events'
import { EventPattern } from '@nestjs/microservices'
import { WorldEvent }   from '../world/event.types'

@Controller()
export class AiController implements OnApplicationBootstrap, OnApplicationShutdown {

    constructor(private service: AiService) {
    }


    @EventPattern(new WorldEvent(PlayerChangedMap.event))
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
