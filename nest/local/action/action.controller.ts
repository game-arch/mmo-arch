import { Controller }              from '@nestjs/common'
import { MessagePattern }          from '@nestjs/microservices'
import { ActionEvent, WorldEvent } from '../world/event.types'
import { AttemptAction, PushMob }  from '../../../shared/events/action.events'
import { MapClient }               from '../map/client/map.client'

@Controller()
export class ActionController {

    constructor(private map: MapClient) {
    }

    @MessagePattern(new WorldEvent(AttemptAction.event))
    onAction(data: AttemptAction) {
        if (data.action === 'push') {
            this.map.client.emit(new ActionEvent(PushMob.event), data)
            return true
        }
        return false
    }
}
