import Scene = Phaser.Scene
import Vector2 = Phaser.Math.Vector2
import Body = Phaser.Physics.Arcade.Body
import Sprite = Phaser.GameObjects.Sprite
import Group = Phaser.GameObjects.Group
import { Physics }    from './physics'
import { Directions } from './directions'
import { isServer }   from '../constants/environment-constants'

export class MobSprite extends Sprite {
    id: number
    x: number
    y: number
    lastVelocity       = new Vector2(0, 0)
    stopped            = true
    moving: Directions = {
        up   : false,
        down : false,
        left : false,
        right: false
    }
    body: Body

    onVelocityChange = () => {
    }
    onStopMoving     = () => {
    }
    onStartMoving    = () => {
    }

    constructor(public name: string = '', scene: Scene, group: Group, x: number, y: number, key: string = !isServer ? 'Template' : '') {
        super(scene, x, y, key, !isServer ? 'template.png' : '')
        this.setSize(64, 64)
        this.setOrigin(0.5, 0.5)
        scene.physics.add.existing(this)
        group.add(this, true)
        this.body.collideWorldBounds = true
    }

    preUpdate(...args: any[]) {
        this.setPosition(Math.round(this.x), Math.round(this.y))
        if (!this.moving) {
            return
        }
        let velocity = Physics.getVelocity(this.moving)
        this.body.setVelocity(velocity.x, velocity.y)
        if (!velocity.equals(this.lastVelocity)) {
            this.lastVelocity = this.body.velocity.clone()
            this.onVelocityChange()
            if (velocity.equals(new Vector2(0, 0))) {
                if (!this.stopped) {
                    this.onStopMoving()
                    this.stopped = true
                }
                return
            }
            if (this.stopped) {
                this.onStartMoving()
                this.stopped = false
            }
        }
    }

    asPayload() {
        return {
            id    : this.id,
            name  : this.name,
            x     : this.x,
            y     : this.y,
            moving: this.moving
        }
    }
}
