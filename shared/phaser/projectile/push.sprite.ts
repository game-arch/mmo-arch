import Body = Phaser.Physics.Arcade.Body
import Scene = Phaser.Scene
import { Projectile }   from './projectile'
import { MobSprite }    from '../mob-sprite'
import { PlayerSprite } from '../player.sprite'
import { NpcSprite }    from '../npc.sprite'
import { Physics }      from '../physics'
import { isServer }     from '../../constants/environment-constants'

export class PushSprite extends Projectile {
    body: Body
    still = true

    constructor(public originator: 'player' | 'npc', public instanceId: number, scene: Scene, x, y, destinationX, destinationY) {
        super(originator, scene, x, y, 2, destinationX, destinationY)
        this.setTexture('rain')
        this.project()
        if (destinationX === x && destinationY === y) {
            this.tween({
                scale: 10
            }, 500)
            this.still = true
        } else {
            this.tween({
                scale: 3
            }, 1000)
            this.still = false
        }
    }

    onHit = (target: MobSprite) => {
        if (isServer) {
            if (this.hasHitSelf(target)) {
                if (this.still) {
                    this.propelSelf(target)
                }
                return
            }
            this.pushAway(target)
        }
    }


    private hasHitSelf(target: MobSprite) {
        return ((this.originator == 'player' && target instanceof PlayerSprite)
            || (this.originator == 'npc' && target instanceof NpcSprite))
            && this.instanceId === target.id
    }

    private pushAway(target: MobSprite) {
        if (!this.targets.includes(target)) {
            this.targets.push(target)
        }
        this.disableMovement(target)
        let velocity = this.still ? Physics.velocityFromDifference(this.x, this.y, target.x, target.y) : this.body.velocity
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


    protected preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta)
    }

    destroy() {
        super.destroy(true)
        this.targets.map(mob => {
            if (mob.movementDisabledBy === this) {
                mob.body.setVelocity(0, 0)
                mob.movementDisabledBy = null
                mob.onVelocityChange()
            }
        })
    }
}
