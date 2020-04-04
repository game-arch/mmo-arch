import { Controller, Inject }            from '@nestjs/common'
import { ClientProxy, MessagePattern }   from '@nestjs/microservices'
import { CommandEvent, WorldEvent }      from '../world/event.types'
import { AttemptCommand, CommandAction } from '../../../shared/events/command.events'
import { Push }                          from '../../../shared/events/actions/movement.actions'
import { LOCAL_CLIENT }                  from '../../client/client.module'

@Controller()
export class CommandController {

    constructor(@Inject(LOCAL_CLIENT) public client: ClientProxy) {
    }

    @MessagePattern(new WorldEvent(AttemptCommand.event))
    onAction(data: CommandAction) {
        if (data.action === 'push') {
            this.client.emit(new CommandEvent(Push.event), data)
            return true
        }
        return false
    }
}
