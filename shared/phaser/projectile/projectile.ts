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

    constructor(scene: Scene, x, y, public destinationX, public destinationY) {
        super(<any>scene, x, y, '', '')
        this.setSize(32, 32)
        this.setOrigin(0.5, 0.5)
        scene.add.existing(this)
        scene.physics.add.existing(this)
        this.body.immovable = true
        this.body.isCircle  = true
    }

    destroy() {
        super.destroy(true)
        if (isServer) {
            this.targets.map(mob => {
                if (mob.pushed === this) {
                    mob.body.setVelocity(0, 0)
                    mob.pushed = null
                }
            })
            this.targets = []
        }
    }
}
