import { Controller, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common'
import { AiService }        from './ai.service'
import { PlayerChangedMap } from '../../../shared/actions/map.actions'
import { EventPattern } from '@nestjs/microservices'
import { WorldEvent }   from '../../lib/event.types'

@Controller()
export class AiController implements OnApplicationBootstrap, OnApplicationShutdown {

    constructor(private service: AiService) {
    }


    @EventPattern(new WorldEvent(PlayerChangedMap.type))
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
