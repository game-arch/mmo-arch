import { Controller, Get, Logger } from '@nestjs/common'
import { WorldGateway }            from './world.gateway'
import { EventPattern }         from '@nestjs/microservices'
import { ServerPresenceOnline } from '../../../shared/events/server-presence.events'
import { WorldService }         from './world.service'

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

    @EventPattern(ServerPresenceOnline.event)
    async onPresenceOnline() {
        await this.gateway.afterInit(this.gateway.server)
    }
}
