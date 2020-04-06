import Body = Phaser.Physics.Arcade.Body
import Scene = Phaser.Scene
import { Projectile }   from './projectile'
import { MobSprite }    from '../mob-sprite'
import { PlayerSprite } from '../player.sprite'
import { NpcSprite }    from '../npc.sprite'
import { Physics }      from '../physics'

export class PushSprite extends Projectile {
    body: Body
    still = true

    constructor(public type: 'player' | 'npc', public mobId: number, scene: Scene, x, y, destinationX, destinationY) {
        super(scene, x, y, 2, destinationX, destinationY)
        this.setTexture('rain')
        this.project()
        if (destinationX === x && destinationY === y) {
            this.tween({
                scale: 10
            }, 500)
            this.still = true
        } else {
            this.tween({
                scale: 6
            }, 1000)
            this.still = false
        }
    }

    onHit = (target: MobSprite) => {
        if (
            (this.type == 'player' && target instanceof PlayerSprite)
            || (this.type == 'npc' && target instanceof NpcSprite)
        ) {
            if (this.mobId === target.id) {
                if (this.still) {
                    if (!this.targets.includes(target)) {
                        this.targets.push(target)
                    }
                    this.propelSelf(target)
                }
                return
            }
        }
        this.pushAway(target)
        if (!this.targets.includes(target)) {
            this.targets.push(target)
        }
    }


    private pushAway(target: MobSprite) {
        target.pushed  = this
        target.walking = false
        if (this.still) {
            let velocity = Physics.velocityFromDifference(this.x, this.y, target.x, target.y)
            target.body.setVelocity(velocity.x * this.speed, velocity.y * this.speed)
            target.onVelocityChange()
            target.tick = 0
        } else {
            target.body.setVelocity(this.body.velocity.x, this.body.velocity.y)
            target.onVelocityChange()
            target.tick = 0
        }
    }

    private propelSelf(target: PlayerSprite | NpcSprite) {
        let velocity = Physics.velocityFromDirections({
            up   : target.body.velocity.y < 0,
            down : target.body.velocity.y > 0,
            right: target.body.velocity.x > 0,
            left : target.body.velocity.x < 0
        })
        velocity.x   = velocity.x * 3
        velocity.y   = velocity.y * 3
        if (!target.lastVelocity.equals(velocity)) {
            target.body.setVelocity(velocity.x, velocity.y)
            target.lastVelocity = velocity
            target.onVelocityChange()
        }
        target.tick    = 0
        target.walking = false
        target.pushed  = this
    }

    protected preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta)
    }

    destroy() {
        super.destroy(true)
        this.targets.map(mob => {
            if (mob.pushed === this) {
                mob.body.setVelocity(0, 0)
                mob.pushed = null
                mob.onVelocityChange()
            }
        })
    }
}
