import Scene = Phaser.Scene
import Vector2 = Phaser.Math.Vector2
import Body = Phaser.Physics.Arcade.Body
import Sprite = Phaser.GameObjects.Sprite
import {Physics}    from './physics'
import {Directions} from './directions'

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
        right: false,
    }
    body: Body

    onVelocityChange = () => {
    }
    onStopMoving     = () => {
    }
    onStartMoving    = () => {
    }

    constructor(public name: string = '', scene: Scene, x: number, y: number, key: string = '') {
        super(scene, x, y, key)
        scene.add.existing(this)
        scene.physics.add.existing(this)
        this.body.setSize(32, 32)
        this.body.collideWorldBounds = true
    }

    preUpdate(...args: any[]) {
        let adjustmentX = Math.round(this.x)
        let adjustmentY = Math.round(this.y)
        if (this.x !== adjustmentX || this.y !== adjustmentY) {
            this.setPosition(adjustmentX, adjustmentY)
        }
        if (!this.moving) {
            return
        }
        let velocity = Physics.getVelocity(this.moving)
        this.body.setVelocity(velocity.x, velocity.y)
        if (!velocity.equals(this.lastVelocity)) {
            this.lastVelocity = this.body.velocity.clone()
            this.onVelocityChange()
            if (velocity.equals(new Vector2(0, 0))) {
                return this.reportStopped()
            }
            return this.reportMoving()
        }
    }

    private reportStopped() {
        if (!this.stopped) {
            this.onStopMoving()
            this.stopped = true
        }
    }

    private reportMoving() {
        if (this.stopped) {
            this.onStartMoving()
            this.stopped = false
        }
    }
    asPayload() {
        return {
            id    : this.id,
            name  : this.name,
            x     : this.x,
            y     : this.y,
            moving: this.moving,
        }
    }
}
