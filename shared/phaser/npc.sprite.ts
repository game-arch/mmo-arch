import { MobSprite }  from './mob-sprite'
import { isServer }   from '../constants/environment-constants'
import { NpcConfig }  from '../interfaces/npc-config'
import { Directions } from './directions'
import { interval }   from 'rxjs'
import { first }      from 'rxjs/operators'
import Group = Phaser.GameObjects.Group
import Scene = Phaser.Scene

export class NpcSprite extends MobSprite {

    walkTick                = 0
    verticalDirections      = ['', 'down', 'up']
    horizontalDirections    = ['', 'left', 'right']
    lastVerticalDirection   = 0
    lastHorizontalDirection = 0
    shouldMove              = false
    speed                   = 0.8

    constructor(scene: Scene, group: Group, public config: NpcConfig) {
        super(config.name, scene, group, config.position[0], config.position[1], !isServer ? config.key || '' : '')
        if (isServer) {
            interval(this.config.moveStart).pipe(first())
                                           .subscribe(() => this.shouldMove = true)
        }
    }

    preUpdate(...args) {
        super.preUpdate(...args)
        if (this.shouldMove && this.config.moveInterval) {
            this.validateDirections()
            this.walkTick++
            if (this.walkTick === Math.floor(this.config.moveInterval * 1.5)) {
                this.stopMoving()
                this.walkTick = 0
            }
            if (this.walkTick === this.config.moveInterval) {
                this.moveInARandomDirection()
            }

            if (this.walkTick === Math.floor(this.config.moveInterval * 1.25)) {
                this.moveInARandomDirection()
            }
        }
    }

    private validateDirections() {
        if (this.npcConfig.movingBounds) {
            let moving = { ...this.moving }
            if (this.x <= this.npcConfig.movingBounds.upperLeft[0]) {
                this.moving.left  = false
                this.moving.right = true
                this.lastMoving   = this.moving
                this.moving       = moving
            }
            if (this.x >= this.npcConfig.movingBounds.bottomRight[0]) {
                this.moving.right = false
                this.moving.left  = true
                this.lastMoving   = this.moving
                this.moving       = moving
            }
            if (this.y <= this.npcConfig.movingBounds.upperLeft[1]) {
                this.moving.up   = false
                this.moving.down = true
                this.lastMoving  = this.moving
                this.moving      = moving
            }
            if (this.y >= this.npcConfig.movingBounds.bottomRight[1]) {
                this.moving.down = false
                this.moving.up   = true
                this.lastMoving  = this.moving
                this.moving      = moving
            }
        }
    }

    moveInARandomDirection() {
        let { vertical, horizontal } = this.getRandomMovement()
        this.lastVerticalDirection   = vertical
        this.lastHorizontalDirection = horizontal
        this.lastMoving              = this.moving
        this.moving                  = {
            ...new Directions(),
            [this.verticalDirections[vertical]]    : true,
            [this.horizontalDirections[horizontal]]: true
        }
    }

    private getRandomMovement() {
        let vertical   = this.getRandomDirection(this.verticalDirections)
        let horizontal = this.getRandomDirection(this.horizontalDirections)
        return { vertical, horizontal }
    }

    stopMoving() {
        this.lastMoving = this.moving
        this.moving     = new Directions()
    }

    getRandomDirection(directions) {
        return Math.floor(Math.random() * directions.length)
    }
}
