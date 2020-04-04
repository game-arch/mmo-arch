import Body = Phaser.Physics.Arcade.Body
import Scene = Phaser.Scene
import { Projectile } from './projectile'
import { Physics }    from '../physics'
import { isServer }   from '../../constants/environment-constants'
import { MobSprite }  from '../mob-sprite'

export class PushSprite extends Projectile {
    body: Body

    constructor(scene: Scene, x, y, destinationX, destinationY) {
        super(scene, x, y, destinationX, destinationY)
        let movement = scene.tweens.add({
            targets : this,
            duration: 1000,
            props   : {
                scale: 4
            }
        })
        movement.on('complete', () => {
            this.destroy()
        })
        let diffX    = Math.round(destinationX - x)
        let diffY    = Math.round(destinationY - y)
        let velocity = Physics.getVelocity({
            right: diffX > 0,
            left : diffX < 0,
            up   : diffY < 0,
            down : diffY > 0
        })
        this.body.setVelocity(velocity.x * 2, velocity.y * 2)
    }

    protected preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta)
        if (isServer) {
            let isFirstEvent = true
            this.scene.physics.world.overlap(this, this.getScene().layers.mobs.npcs, (obj1: any, obj2: any) => {
                let projectile: Projectile = obj1 instanceof Projectile ? obj1 : obj2
                let npc: MobSprite         = obj1 instanceof MobSprite ? obj1 : obj2
                if (!npc.pushed || npc.pushed === this || isFirstEvent) {
                    isFirstEvent = false
                    npc.pushed   = projectile
                    npc.walking  = false
                    npc.body.setVelocity(projectile.body.velocity.x, projectile.body.velocity.y)
                    if (!projectile.targets.includes(npc)) {
                        projectile.targets.push(npc)
                        npc.onVelocityChange()
                        npc.tick = 0
                    }
                }
                return true
            })
        }
    }
}
