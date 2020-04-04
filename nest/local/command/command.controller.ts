import { Controller }              from '@nestjs/common'
import { MessagePattern }          from '@nestjs/microservices'
import { ActionEvent, WorldEvent }      from '../world/event.types'
import { AttemptCommand, CommandAction} from '../../../shared/events/command.events'
import { MapClient } from '../map/client/map.client'
import { Push }      from '../../../shared/events/actions/movement.actions'

@Controller()
export class CommandController {

    constructor(private map: MapClient) {
    }

    @MessagePattern(new WorldEvent(AttemptCommand.event))
    onAction(data: CommandAction) {
        if (data.action === 'push') {
            this.map.client.emit(new ActionEvent(Push.event), data)
            return true
        }
        return false
    }
}
