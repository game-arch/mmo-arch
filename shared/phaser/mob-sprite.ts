import Scene = Phaser.Scene
import Vector2 = Phaser.Math.Vector2
import Body = Phaser.Physics.Arcade.Body
import Sprite = Phaser.GameObjects.Sprite
import Group = Phaser.GameObjects.Group
import { Physics }    from './physics'
import { Directions } from './directions'
import { isServer }   from '../constants/environment-constants'
import { Mob }        from './mob'

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

    tick = 0

    lastPosition = {
        x: 0,
        y: 0
    }

    preUpdate(...args: any[]) {
        this.setPosition(Math.round(this.x), Math.round(this.y))
        if (!this.moving) {
            return
        }
        if (this.body.velocity.equals(new Vector2(0, 0))) {
            if (!this.stopped) {
                this.onStopMoving()
                this.stopped = true
            }
        } else {
            if (this.stopped) {
                this.onStartMoving()
                this.stopped = false
            }
        }
        let velocity = Physics.getVelocity(this.moving)
        this.body.setVelocity(velocity.x, velocity.y)
        if (!velocity.equals(this.lastVelocity)) {
            this.lastVelocity = this.body.velocity.clone()
            this.onVelocityChange()
        }
        this.tick++
        if ((this.lastPosition.x !== this.body.x || this.lastPosition.y !== this.body.y)) {
            this.lastPosition.x = this.body.x
            this.lastPosition.y = this.body.y
            if (this.tick > 50) {
                this.onVelocityChange()
                this.tick = 0
            }
        } else {

        }
    }

    asPayload(map: string): Mob {
        return {
            id        : this.id,
            instanceId: this.id,
            mobId     : this.id,
            map,
            name      : this.name,
            x         : this.x,
            y         : this.y,
            moving    : this.moving
        } as Mob
    }
}
