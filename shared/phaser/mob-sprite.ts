import Scene = Phaser.Scene
import Vector2 = Phaser.Math.Vector2
import Body = Phaser.Physics.Arcade.Body
import Sprite = Phaser.GameObjects.Sprite
import Group = Phaser.GameObjects.Group
import Tween = Phaser.Tweens.Tween
import { Physics }    from './physics'
import { Directions } from './directions'
import { isServer }   from '../constants/environment-constants'
import { Mob }        from './mob'
import { NpcConfig }  from '../interfaces/npc-config'

export class MobSprite extends Sprite {
    id: number
    lastVelocity           = new Vector2(0, 0)
    walking                = true
    directions: Directions = new Directions()
    body: Body
    npcConfig?: NpcConfig

    latencyModifier = 1

    speed = 1

    onVelocityChange = () => {
    }
    onStopMoving     = () => {
    }
    onStartMoving    = () => {
    }

    constructor(public name: string = '', scene: Scene, group: Group, public x: number, public y: number, key: string = !isServer ? 'Template' : '') {
        super(scene, x, y, key, !isServer ? 'template.png' : '')
        this.setSize(64, 64)
        this.setOrigin(0.5, 0.5)
        scene.add.existing(this)
        group.add(this)
        scene.physics.add.existing(this)
        this.body.collideWorldBounds = true


    }

    destX = 0
    destY = 0
    interpolation: Tween

    interpolate(x, y) {
        this.destX = x
        this.destY = y
        if (this.interpolation) {
            this.interpolation.remove()
        }
        if (!this.interpolation) {
            this.interpolation = this.scene.tweens.add({
                targets: this,
                props  : {
                    x: {
                        duration: 300,
                        value   : () => this.destX
                    },
                    y: {
                        duration: 300,
                        value   : () => this.destY
                    }
                }
            })
        }
        this.interpolation.updateTo('x', this.destX, true)
        this.interpolation.updateTo('y', this.destY, true)
    }

    preUpdate(...args: any[]) {
        if (!this.directions) {
            return
        }
        if (this.body.velocity.equals(new Vector2(0, 0))) {
            if (this.walking) {
                this.onStopMoving()
                this.walking = false
            }
        } else {
            if (!this.walking) {
                this.onStartMoving()
                this.walking = true
            }
        }
        let velocity = Physics.getVelocity(this.directions, this.speed)
        this.body.setVelocity(velocity.x, velocity.y)
        if (velocity.x === 0 && velocity.y === 0) {
            if (this.x !== this.destX || this.y !== this.destY) {
                if (this.interpolation) {
                    this.setPosition(this.destX, this.destY)
                }
            }
        }
        if (!velocity.equals(this.lastVelocity)) {
            this.lastVelocity = this.body.velocity.clone()
            this.onVelocityChange()
        }
    }


    asPayload(map: string): Mob {
        return {
            id        : this.id,
            instanceId: this.id,
            mobId     : this.id,
            map,
            name      : this.name,
            x         : Math.round(this.x),
            y         : Math.round(this.y),
            moving    : this.directions
        } as Mob
    }
}
