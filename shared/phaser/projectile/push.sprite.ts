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

    onHit = (other: MobSprite) => {
        if (
            (this.type == 'player' && other instanceof PlayerSprite)
            || (this.type == 'npc' && other instanceof NpcSprite)
        ) {
            if (this.mobId === other.id) {
                if (this.still) {
                    if (!this.targets.includes(other)) {
                        this.targets.push(other)
                    }

                    let velocity = Physics.velocityFromDirections({
                        up   : other.body.velocity.y < 0,
                        down : other.body.velocity.y > 0,
                        right: other.body.velocity.x > 0,
                        left : other.body.velocity.x < 0
                    })
                    velocity.x   = velocity.x * 3
                    velocity.y   = velocity.y * 3
                    if (!other.lastVelocity.equals(velocity)) {
                        other.body.setVelocity(velocity.x, velocity.y)
                        other.onVelocityChange()
                    }
                    other.tick    = 0
                    other.walking = false
                    other.pushed  = this
                }
                return
            }
        }
        other.pushed  = this
        other.walking = false
        if (this.still) {
            let velocity = Physics.velocityFromDifference(this.x, this.y, other.x, other.y)
            other.body.setVelocity(velocity.x * this.speed, velocity.y * this.speed)
            other.onVelocityChange()
            other.tick = 0
        } else {
            other.body.setVelocity(this.body.velocity.x, this.body.velocity.y)
            other.onVelocityChange()
            other.tick = 0
        }
        if (!this.targets.includes(other)) {
            this.targets.push(other)
        }
    }


    protected preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta)
    }
}
