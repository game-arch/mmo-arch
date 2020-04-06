import Sprite = Phaser.GameObjects.Sprite
import Body = Phaser.Physics.Arcade.Body
import Scene = Phaser.Scene
import { MobSprite }    from '../mob-sprite'
import { BaseScene }    from '../base.scene'
import { Physics }      from '../physics'
import { PlayerSprite } from '../player.sprite'
import { NpcSprite }    from '../npc.sprite'

export class Projectile extends Sprite {
    body: Body

    targets: MobSprite[] = []

    getScene() {
        return this.scene as BaseScene
    }

    constructor(public originator: 'player' | 'npc' | 'all', scene: Scene, x, y, public speed: number, public destinationX, public destinationY) {
        super(<any>scene, x, y, '', null)
        scene.add.existing(this)
        scene.physics.add.existing(this)
        this.setSize(32, 32)
        this.setOrigin(0.5, 0.5)
        this.body.setOffset(-8, -8)
        this.body.immovable = true
        this.body.isCircle  = true
    }

    protected tween(props: { [key: string]: any }, duration = 300) {
        let movement = this.scene.tweens.add({
            targets: this,
            duration,
            props
        })
        movement.on('complete', () => {
            this.destroy()
        })
    }

    protected project() {
        let velocity = Physics.velocityFromDifference(this.x, this.y, this.destinationX, this.destinationY)
        this.angle   = Physics.angleFromVelocity(velocity.x, velocity.y)
        this.body.setVelocity(velocity.x * this.speed, velocity.y * this.speed)
    }


    onHit = (other: MobSprite) => {
    }

    protected preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta)
        this.scene.physics.world.overlap(
            this,
            this.getScene().allMobSprites,
            (obj1: any, obj2: any) => this.onHit(obj1 instanceof MobSprite ? obj1 : obj2)
        )
    }

    disableMovement(target: PlayerSprite | NpcSprite) {
        target.tick               = 0
        target.walking            = false
        target.movementDisabledBy = this
    }
}
