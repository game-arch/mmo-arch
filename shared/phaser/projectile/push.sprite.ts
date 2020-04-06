import Body = Phaser.Physics.Arcade.Body
import Scene = Phaser.Scene
import { Projectile, ProjectileConfig } from './projectile'
import { MobSprite }                    from '../mob-sprite'
import { PlayerSprite }                 from '../player.sprite'
import { NpcSprite }                    from '../npc.sprite'
import { Physics }                      from '../physics'
import { isServer }                     from '../../constants/environment-constants'

export class PushSprite extends Projectile {
    body: Body

    constructor(originatorType: 'player' | 'npc', originator: number, scene: Scene, x, y, destinationX, destinationY) {
        super(<ProjectileConfig>{
            originatorType: originatorType,
            originator    : originator,
            scene,
            duration      : destinationX === x && destinationY === y ? 1000 : 500,
            speed         : 3,
            position      : [x, y],
            growTo        : destinationX === x && destinationY === y ? 10 : 5,
            type          : destinationX === x && destinationY === y ? 'central' : 'cone',
            key           : 'rain',
            destination   : [destinationX, destinationY]
        })
    }

    onHit = (target: MobSprite) => {
        if (isServer) {
            if (this.hasHitSelf(target)) {
                if (this.config.type === 'central') {
                    this.propelSelf(target)
                }
                return
            }
            this.pushAway(target)
        }
    }

    private pushAway(target: MobSprite) {
        if (!this.targets.includes(target)) {
            this.targets.push(target)
        }
        this.disableMovement(target)
        let velocity = this.config.type === 'central' ? Physics.velocityFromDifference(this.x, this.y, target.x, target.y) : this.body.velocity
        target.body.setVelocity(velocity.x, velocity.y)
        target.onVelocityChange()
    }

    private propelSelf(target: PlayerSprite | NpcSprite) {
        if (!this.targets.includes(target)) {
            this.targets.push(target)
        }
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
