import { Controller, Inject }            from '@nestjs/common'
import { ClientProxy, MessagePattern }   from '@nestjs/microservices'
import { CommandEvent, WorldEvent }      from '../../lib/event.types'
import { AttemptCommand, CommandAction } from '../../../shared/actions/command.actions'
import { Push }                          from '../../../shared/actions/movement.actions'
import { LOCAL_CLIENT }                  from '../../client/client.module'

@Controller()
export class CommandController {

    constructor(@Inject(LOCAL_CLIENT) public client: ClientProxy) {
    }

    @MessagePattern(new WorldEvent(AttemptCommand.type))
    onAction(data: CommandAction) {
        if (data.action === 'push') {
            this.client.emit(new CommandEvent(Push.type), data)
            return true
        }
        return false
    }
}
