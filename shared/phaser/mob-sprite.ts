import Scene = Phaser.Scene
import Vector2 = Phaser.Math.Vector2
import Body = Phaser.Physics.Arcade.Body
import Sprite = Phaser.GameObjects.Sprite
import Group = Phaser.GameObjects.Group
import { Physics }    from './physics'
import { Directions } from './directions'
import { isServer }   from '../constants/environment-constants'
import { Mob }        from './mob'
import { NpcConfig }  from '../interfaces/npc-config'

export class MobSprite extends Sprite {
    stoppedVector          = new Vector2(0, 0)
    lastVelocity           = new Vector2(0, 0)
    walking                = true
    directions: Directions = new Directions()
    body: Body
    npcConfig?: NpcConfig
    speed                  = 1

    onVelocityChange        = () => {
    }
    onStopMoving            = () => {
    }
    onStartMoving           = () => {
    }
    movementDisabledBy: any = null

    facing = {
        x: 0,
        y: 0
    }

    constructor(public id: number, scene: Scene, group: Group, public x: number, public y: number, key: string = !isServer ? 'Template' : '') {
        super(scene, x, y, key, !isServer ? 'template.png' : '')
        this.setSize(64, 64)
        this.setOrigin(0.5, 0.5)
        scene.add.existing(this)
        group.add(this)
        scene.physics.add.existing(this)
        this.body.collideWorldBounds = true
        this.body.immovable          = false
    }

    shouldInterpolate = false
    tick              = 0

    preUpdate(...args: any[]) {
        this.tick++
        if (!this.directions) {
            return
        }
        if (this.body.velocity.equals(this.stoppedVector)) {
            if (this.walking) {
                this.onStopMoving()
                this.walking = false
                this.updateFacing(this.lastVelocity)
            }
        } else {
            if (!this.walking) {
                this.onStartMoving()
                this.walking = true
            }

            if (isServer) {
                if (this.tick % 20 === 0) {
                    this.onVelocityChange()
                    this.tick = 0
                }
            }
        }
        if (isServer) {
            if (!this.movementDisabledBy) {
                let velocity = Physics.velocityFromDirections(this.directions, this.speed)
                this.body.setVelocity(velocity.x, velocity.y)
            }
        }
        if (!this.body.velocity.equals(this.lastVelocity)) {
            if (!this.body.velocity.equals(this.stoppedVector) && !this.movementDisabledBy) {
                this.updateFacing(this.body.velocity)
            }
            if (isServer) {
                this.onVelocityChange()
            }
        }
        this.lastVelocity = this.body.velocity.clone()
    }


    private updateFacing(velocity: Vector2) {
        this.facing = {
            x: velocity.x > 0 ? 1 : velocity.x < 0 ? -1 : 0,
            y: velocity.y > 0 ? 1 : velocity.y < 0 ? -1 : 0
        }
    }

    asPayload(map: string): Mob {
        return {
            id        : this.id,
            instanceId: this.id,
            mobId     : this.id,
            velX      : this.body.velocity.x,
            velY      : this.body.velocity.y,
            map,
            name      : this.name,
            x         : Math.round(this.x),
            y         : Math.round(this.y)
        } as Mob
    }
}
