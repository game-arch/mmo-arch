import { Controller, Inject, OnApplicationBootstrap } from '@nestjs/common'
import { ClientProxy, MessagePattern }                from '@nestjs/microservices'
import { CommandEvent, WorldEvent }                   from '../../lib/event.types'
import { AttemptCommand, CommandAction }              from '../../../shared/actions/command.actions'
import { LOCAL_CLIENT }                               from '../../client/client.module'
import { CoolDownService }                            from './cool-down.service'

@Controller()
export class CommandController implements OnApplicationBootstrap {

    constructor(
        @Inject(LOCAL_CLIENT) public client: ClientProxy,
        private coolDown: CoolDownService
    ) {
    }

    @MessagePattern(new WorldEvent(AttemptCommand.type))
    async onAction(data: CommandAction) {
        if (!await this.coolDown.coolingDown(data.characterId, data.action)) {
            this.client.emit(new CommandEvent(data.action), data)
        }
    }

    async onApplicationBootstrap() {
        await this.coolDown.clear()
    }
}
