import { Controller }       from '@nestjs/common'
import { WorldGateway }     from '../world.gateway'
import { WorldService }     from '../world.service'
import { Push }             from '../../../../shared/actions/movement.actions'
import { EventPattern }     from '@nestjs/microservices'
import { CommandEvent }     from '../../../lib/event.types'
import { Repository }       from 'typeorm'
import { Player }           from '../entities/player'
import { InjectRepository } from '@nestjs/typeorm'
import { ShootArrow }       from '../../../../shared/actions/battle.actions'

@Controller()
export class CommandController {

    constructor(
        @InjectRepository(Player)
        private players: Repository<Player>,
        private service: WorldService,
        private gateway: WorldGateway
    ) {
    }

    @EventPattern(new CommandEvent(Push.action))
    async onPush(data: Push) {
        const player = await this.players.findOne({ characterId: data.characterId })
        if (player) {
            this.gateway.server.to('map.' + player.map + '.' + player.channel).emit(Push.type, data)
        }
    }

    @EventPattern(new CommandEvent(ShootArrow.action))
    async onArrow(data: ShootArrow) {
        const player = await this.players.findOne({ characterId: data.characterId })
        if (player) {
            this.gateway.server.to('map.' + player.map + '.' + player.channel).emit(ShootArrow.type, data)
        }
    }
}
