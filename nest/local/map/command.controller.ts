import { Controller, Inject, Logger } from '@nestjs/common'
import { MapEmitter }                 from './map.emitter'
import { MapService }                 from './map.service'
import { InjectRepository }           from '@nestjs/typeorm'
import { Player }                     from './entities/player'
import { Repository }                 from 'typeorm'
import { Channel }                    from './entities/channel'
import { Push }                       from '../../../shared/actions/movement.actions'
import { ClientProxy, EventPattern }  from '@nestjs/microservices'
import { CommandEvent }               from '../../lib/event.types'
import { PushSprite }                 from '../../../shared/phaser/projectile/push.sprite'
import { LOCAL_CLIENT }               from '../../client/client.module'
import { ShootArrow }                 from '../../../shared/actions/battle.actions'
import { ArrowSprite }                from '../../../shared/phaser/projectile/arrow.sprite'

@Controller()
export class CommandController {

    constructor(
        private logger: Logger,
        @Inject(LOCAL_CLIENT) private client: ClientProxy,
        private readonly emitter: MapEmitter,
        private readonly service: MapService,
        @InjectRepository(Player) private playerRepo: Repository<Player>,
        @InjectRepository(Channel) private instances: Repository<Channel>
    ) {
    }

    @EventPattern(new CommandEvent(Push.action))
    onPush(data: Push) {
        if (this.service.map.playerSprites[data.characterId]) {
            let player     = this.service.map.playerSprites[data.characterId]
            let projectile = new PushSprite(
                'player',
                data.characterId,
                this.service.map,
                player.x,
                player.y,
                data.actionArgs ? data.actionArgs.x || player.x : player.x,
                data.actionArgs ? data.actionArgs.y || player.y : player.y
            )
        }
    }

    @EventPattern(new CommandEvent(ShootArrow.action))
    onArrow(data: ShootArrow) {
        if (this.service.map.playerSprites[data.characterId]) {
            let player     = this.service.map.playerSprites[data.characterId]
            let projectile = new ArrowSprite(
                'player',
                data.characterId,
                this.service.map,
                player.x,
                player.y,
                data.actionArgs ? data.actionArgs.x || player.x : player.x,
                data.actionArgs ? data.actionArgs.y || player.y : player.y
            )
        }
    }
}
