import { InjectRepository }  from '@nestjs/typeorm'
import { CommandExecution }  from './entities/command-execution'
import { Repository }        from 'typeorm'
import { interval, Subject } from 'rxjs'
import { takeUntil }         from 'rxjs/operators'
import { COOL_DOWNS }        from '../../../shared/commands/cooldown.config'
import { Injectable }        from '@nestjs/common'

@Injectable()
export class CoolDownService {
    executions: { [characterId: number]: { [action: string]: CommandExecution } } = {}
    replenishing: { [id: number]: boolean }                                       = {}

    constructor(@InjectRepository(CommandExecution) private executed: Repository<CommandExecution>) {
    }

    async clear() {
        await this.executed.clear()
        this.executions   = {}
        this.replenishing = {}
    }

    async coolingDown(characterId: number, action: string) {
        let execution = await this.getLatestExecution(characterId, action)
        if (this.validate(characterId, action)) {
            this.executions[characterId][action] = execution
            execution.lastPerformed              = new Date()
            if (COOL_DOWNS[action]) {
                execution.available--
                if (execution.available < 0) {
                    execution.available = 0
                }
            }
            await this.executed.save(execution)
            this.replenish(execution)
            return false
        }
        return true
    }

    validate(characterId, action) {
        let execution = this.executions[characterId][action]
        if (execution) {
            if (COOL_DOWNS[action]) {
                if (execution.available <= 0 && new Date().valueOf() - execution.lastPerformed.valueOf() < COOL_DOWNS[action].delay) {
                    return false
                }
            }
        }
        return true
    }

    private async getLatestExecution(characterId: number, action: string) {
        this.executions[characterId]         = this.executions[characterId] || {}
        this.executions[characterId][action] = this.executions[characterId][action] || await this.executed.findOne({
            characterId: characterId,
            action     : action
        })
        return this.executions[characterId][action] || this.createExecution(characterId, action)
    }

    private createExecution(characterId: number, action: string) {
        let execution         = new CommandExecution()
        execution.characterId = characterId
        execution.action      = action
        execution.available   = COOL_DOWNS[action] ? COOL_DOWNS[action].count : 1
        execution.delay       = COOL_DOWNS[action] ? COOL_DOWNS[action].delay : 1000
        execution.count       = COOL_DOWNS[action] ? COOL_DOWNS[action].count : 1
        return execution
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
