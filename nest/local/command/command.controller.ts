import { Controller, Inject }            from '@nestjs/common'
import { ClientProxy, MessagePattern }   from '@nestjs/microservices'
import { CommandEvent, WorldEvent }      from '../../lib/event.types'
import { AttemptCommand, CommandAction } from '../../../shared/actions/command.actions'
import { Push }                          from '../../../shared/actions/movement.actions'
import { LOCAL_CLIENT }                  from '../../client/client.module'
import { COOLDOWNS }                     from './config/cooldowns'
import { InjectRepository }              from '@nestjs/typeorm'
import { CommandExecution }              from './entities/command-execution'
import { Repository }                    from 'typeorm'

@Controller()
export class CommandController {
    lastExecuted: { [characterId: number]: { [action: string]: number } } = {}

    constructor(
        @Inject(LOCAL_CLIENT) public client: ClientProxy,
        @InjectRepository(CommandExecution) private executed: Repository<CommandExecution>
    ) {
    }

    @MessagePattern(new WorldEvent(AttemptCommand.type))
    async onAction(data: CommandAction) {
        if (data.action === 'push') {
            let execution = await this.executed.findOne({ characterId: data.characterId, action: data.action })
            if (!execution) {
                execution             = new CommandExecution()
                execution.characterId = data.characterId
                execution.action      = data.action
            } else {
                if (COOLDOWNS[data.action]) {
                    if (new Date().valueOf() - execution.lastPerformed.valueOf() < COOLDOWNS[data.action]) {
                        return false
                    }
                }
            }
            this.client.emit(new CommandEvent(Push.type), data)
            execution.lastPerformed = new Date()
            await this.executed.save(execution)
            return true
        }
        return false
    }
}
