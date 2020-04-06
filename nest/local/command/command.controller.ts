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
import { interval, Subject }             from 'rxjs'
import { takeUntil }                     from 'rxjs/operators'

@Controller()
export class CommandController {
    executions: { [characterId: number]: { [action: string]: CommandExecution } } = {}
    replenishing: { [id: number]: boolean }                                       = {}

    constructor(
        @Inject(LOCAL_CLIENT) public client: ClientProxy,
        @InjectRepository(CommandExecution) private executed: Repository<CommandExecution>
    ) {
    }

    @MessagePattern(new WorldEvent(AttemptCommand.type))
    async onAction(data: CommandAction) {
        if (data.action === 'push') {
            this.executions[data.characterId]              = this.executions[data.characterId] || {}
            this.executions[data.characterId][data.action] = this.executions[data.characterId][data.action] || await this.executed.findOne({
                characterId: data.characterId,
                action     : data.action
            })
            let execution                                  = this.executions[data.characterId][data.action]
            if (!execution) {
                execution             = new CommandExecution()
                execution.characterId = data.characterId
                execution.action      = data.action
                execution.available   = COOLDOWNS[data.action] ? COOLDOWNS[data.action].count : 1
                execution.delay       = COOLDOWNS[data.action] ? COOLDOWNS[data.action].delay : 1000
                execution.count       = COOLDOWNS[data.action].count
            } else {
                if (COOLDOWNS[data.action]) {
                    if (execution.available <= 0 && new Date().valueOf() - execution.lastPerformed.valueOf() < COOLDOWNS[data.action].delay) {
                        return false
                    }
                }
            }
            this.client.emit(new CommandEvent(Push.type), data)
            execution.lastPerformed = new Date()
            if (COOLDOWNS[data.action]) {
                execution.available--
                if (execution.available < 0) {
                    execution.available = 0
                }
            }
            await this.executed.save(execution)
            this.replenish(execution)
            return true
        }
        return false
    }

    replenish(execution: CommandExecution) {
        if (!this.replenishing[execution.id]) {
            this.replenishing[execution.id] = true
            let done                        = new Subject()
            interval(execution.delay)
                .pipe(takeUntil(done))
                .subscribe(async () => {
                    if (execution.available >= execution.count) {
                        this.replenishing[execution.id] = false
                        done.next()
                        return
                    }
                    execution.available++
                    await this.executed.save(execution)
                })
        }
    }
}
