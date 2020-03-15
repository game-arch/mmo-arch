import { Controller, Get, Logger } from '@nestjs/common'
import { WorldGateway }            from './world.gateway'
import { EventPattern }            from '@nestjs/microservices'
import { PresenceOnline }          from '../../global/presence/actions'
import { WorldService }            from './world.service'

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
}
