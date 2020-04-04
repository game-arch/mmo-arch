import { Controller, Logger } from '@nestjs/common'
import { MapEmitter }         from './map.emitter'
import { MapService }         from './map.service'
import { InjectRepository }   from '@nestjs/typeorm'
import { Player }             from './entities/player'
import { Repository }         from 'typeorm'
import { Channel }            from './entities/channel'
import { Push }               from '../../../shared/events/actions/movement.actions'
import { EventPattern }       from '@nestjs/microservices'
import { ActionEvent }        from '../world/event.types'
import { PushSprite }         from '../../../shared/phaser/projectile/push.sprite'

@Controller()
export class ActionsController {

    constructor(
        private logger: Logger,
        private readonly emitter: MapEmitter,
        private readonly service: MapService,
        @InjectRepository(Player) private playerRepo: Repository<Player>,
        @InjectRepository(Channel) private instances: Repository<Channel>
    ) {
    }

    @EventPattern(new ActionEvent(Push.event))
    onPush(data: Push) {

        if (this.service.map.playerSprites[data.characterId]) {

            let player     = this.service.map.playerSprites[data.characterId]
            let projectile = new PushSprite(
                this.service.map,
                player.x,
                player.y,
                data.actionArgs.x,
                data.actionArgs.y
            )
        }
    }
}
