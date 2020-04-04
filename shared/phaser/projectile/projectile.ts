import Sprite = Phaser.GameObjects.Sprite
import Body = Phaser.Physics.Arcade.Body
import Scene = Phaser.Scene
import { MobSprite } from '../mob-sprite'
import { BaseScene } from '../base.scene'
import { isServer }  from '../../constants/environment-constants'

export class Projectile extends Sprite {
    body: Body

    targets: MobSprite[] = []

    getScene() {
        return this.scene as BaseScene
    }

    constructor(scene: Scene, x, y, public destinationX, public destinationY, texture: string = '', frame: string | number = 0) {
        super(<any>scene, x, y, texture, frame)
        this.setSize(32, 32)
        scene.add.existing(this)
        scene.physics.add.existing(this)
        this.body.immovable = true
        this.body.isCircle  = true

    }

    destroy() {
        super.destroy(true)
        this.targets.map(mob => {
            if (mob.pushed === this) {
                mob.body.setVelocity(0, 0)
                mob.pushed = null
            }
        })
    }

    protected preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta)
        if (isServer) {
            this.scene.physics.world.overlap(this, this.getScene().layers.mobs.npcs, (obj1: any, obj2: any) => {
                let projectile: Projectile = obj1 instanceof Projectile ? obj1 : obj2
                let npc: MobSprite         = obj1 instanceof MobSprite ? obj1 : obj2
                if (!projectile.targets.includes(npc)) {
                    projectile.targets.push(npc)
                    npc.pushed  = projectile
                    npc.walking = false
                    npc.tick    = 0
                    npc.onVelocityChange()
                }
                npc.body.setVelocity(projectile.body.velocity.x, projectile.body.velocity.y)
            })
        }
    }
}
