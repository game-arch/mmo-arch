import { Controller, Get, Logger } from '@nestjs/common'
import { WorldGateway }            from './world.gateway'
import { EventPattern }            from '@nestjs/microservices'
import { ServerPresenceOnline }    from '../../../shared/actions/server-presence.actions'
import { WorldService }            from './world.service'
import { GlobalEvent }             from '../../lib/event.types'

@Controller()
export class WorldController {


    constructor(
        private logger: Logger,
        private service: WorldService,
        private gateway: WorldGateway
    ) {

    }

    @Get('health')
    health() {
        return 'OK'
    }

    @EventPattern(new GlobalEvent(ServerPresenceOnline.type))
    async onPresenceOnline() {
        await this.gateway.afterInit(this.gateway.server)
    }
}
