import { Controller, Inject, Logger }         from '@nestjs/common'
import { MapEmitter }                         from './map.emitter'
import { MapService }                         from './map.service'
import { InjectRepository }                   from '@nestjs/typeorm'
import { Player }                             from './entities/player'
import { Repository }                         from 'typeorm'
import { Channel }                            from './entities/channel'
import { Push }                               from '../../../shared/actions/movement.actions'
import { ClientProxy, EventPattern }          from '@nestjs/microservices'
import { CommandEvent }                       from '../../lib/event.types'
import { LOCAL_CLIENT }                       from '../../client/client.module'
import { ShootArrow }                         from '../../../shared/actions/battle.actions'
import { ProjectileConfig, ProjectileSprite } from '../../../shared/phaser/projectile/projectile.sprite'
import { COMMANDS }                           from '../../../shared/commands/command.config'
import { CommandAction }                      from '../../../shared/actions/command.actions'

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
            this.createProjectile(COMMANDS.push.projectile, data)
        }
    }

    @EventPattern(new CommandEvent(ShootArrow.action))
    onArrow(data: ShootArrow) {
        if (this.service.map.playerSprites[data.characterId]) {
            this.createProjectile(COMMANDS.shootArrow.projectile, data)
        }
    }

    createProjectile(config: Partial<ProjectileConfig>, data: CommandAction) {
        let player = this.service.map.playerSprites[data.characterId]
        new ProjectileSprite(<ProjectileConfig>{
            ...config,
            originatorType: 'player',
            originator    : data.characterId,
            scene         : this.service.map,
            position      : [player.x, player.y],
            destination   : [data.actionArgs ? data.actionArgs.x || player.x : player.x,
                             data.actionArgs ? data.actionArgs.y || player.y : player.y]
        })
    }
}
