import Body = Phaser.Physics.Arcade.Body
import Scene = Phaser.Scene
import { ProjectileConfig, ProjectileSprite } from './projectile.sprite'
import { MobSprite }                          from '../mob-sprite'
import { PlayerSprite }                       from '../player.sprite'
import { NpcSprite }                          from '../npc.sprite'
import { Physics }                            from '../physics'
import { isServer }                           from '../../constants/environment-constants'

export class PushSprite extends ProjectileSprite {
    body: Body

    constructor(originatorType: 'player' | 'npc', originator: number, scene: Scene, x, y, destinationX, destinationY) {
        super(<ProjectileConfig>{
            originatorType: originatorType,
            originator    : originator,
            scene,
            duration      : destinationX === x && destinationY === y ? 300 : 500,
            speed         : 3,
            position      : [x, y],
            growTo        : destinationX === x && destinationY === y ? 14 : 5,
            type          : destinationX === x && destinationY === y ? 'central' : 'cone',
            key           : 'rain',
            destination   : [destinationX, destinationY]
        })
    }

    onTargetHit(target: MobSprite) {
        super.onTargetHit(target)
        if (isServer) {
            this.disableMovement(target)
            let velocity = this.config.type === 'central' ? Physics.velocityFromDifference(this.x, this.y, target.x, target.y) : this.body.velocity
            target.body.setVelocity(velocity.x, velocity.y)
            target.onVelocityChange()
        }
    }

    onSelfHit(target: PlayerSprite | NpcSprite) {
        super.onSelfHit(target)
        if (isServer && this.config.type == 'central') {
            let velocity = Physics.velocityFromDirections({
                up   : target.body.velocity.y < 0,
                down : target.body.velocity.y > 0,
                right: target.body.velocity.x > 0,
                left : target.body.velocity.x < 0
            })
            velocity.x   = velocity.x * 3
            velocity.y   = velocity.y * 3
            this.disableMovement(target)
            if (!target.lastVelocity.equals(velocity)) {
                target.body.setVelocity(velocity.x, velocity.y)
                target.lastVelocity = velocity
                target.onVelocityChange()
            }
        }
    }
}
