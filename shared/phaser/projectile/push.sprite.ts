import Body = Phaser.Physics.Arcade.Body
import { Projectile } from './projectile'
import { Physics }    from '../physics'
import { isServer }   from '../../constants/environment-constants'
import { MobSprite }  from '../mob-sprite'
import { BaseScene }  from '../base.scene'

export class PushSprite extends Projectile {
    body: Body

    constructor(scene: BaseScene, x, y, destinationX, destinationY) {
        super(scene, x, y, destinationX, destinationY)
        let movement = scene.tweens.add({
            targets : this,
            duration: 500,
            props   : {
                scale: 6
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
            this.scene.physics.world.overlap(this, this.getScene().layers.mobs.npcs, (obj1: any, obj2: any) => {
                let projectile: Projectile = obj1 instanceof Projectile ? obj1 : obj2
                let npc: MobSprite         = obj1 instanceof MobSprite ? obj1 : obj2
                npc.pushed                 = projectile
                npc.walking                = false
                npc.body.setVelocity(projectile.body.velocity.x, projectile.body.velocity.y)
                if (!projectile.targets.includes(npc)) {
                    projectile.targets.push(npc)
                    npc.onVelocityChange()
                    npc.tick = 0
                }
                return true
            })
        }
    }
}
