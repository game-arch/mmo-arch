import { Controller }   from '@nestjs/common'
import { MapService }   from './map.service'
import { EventPattern } from '@nestjs/microservices'
import { ActionEvent }  from '../world/event.types'
import { PushMob }      from '../../../shared/events/action.events'

@Controller()
export class MapActionController {

    constructor(private service: MapService) {
    }

    @EventPattern(new ActionEvent(PushMob.event))
    onPush(data: PushMob) {
        console.log(data)
    }
}
