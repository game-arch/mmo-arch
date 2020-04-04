import { MobSprite }  from './mob-sprite'
import { isServer }   from '../constants/environment-constants'
import { NpcConfig }  from '../interfaces/npc-config'
import { Directions } from './directions'
import Group = Phaser.GameObjects.Group
import Scene = Phaser.Scene

export class NpcSprite extends MobSprite {

    walkTick                = 0
    verticalDirections      = ['', 'down', 'up']
    horizontalDirections    = ['', 'left', 'right']
    lastVerticalDirection   = 0
    lastHorizontalDirection = 0
    speed                   = 0.8
    moveInterval            = Math.floor(Math.random() * 300) + 100

    constructor(scene: Scene, group: Group, public config: NpcConfig) {
        super(config.instanceId, scene, group, config.position[0], config.position[1], !isServer ? config.key || '' : '')
    }

    preUpdate(...args) {
        super.preUpdate(...args)
        if (isServer) {
            this.validateDirections()
            this.walkTick++
            if (this.walkTick === Math.floor(this.moveInterval * 1.4)) {
                this.stopMoving()
                this.walkTick     = 0
                this.moveInterval = Math.floor(Math.random() * 300) + 100
            }
            if (this.walkTick === this.moveInterval) {
                this.moveInARandomDirection()
            }

            if (this.walkTick === Math.floor(this.moveInterval * 1.2)) {
                this.moveInARandomDirection()
            }
        }
    }

    private validateDirections() {
        if (this.npcConfig.movingBounds) {
            if (this.x <= this.npcConfig.movingBounds.upperLeft[0]) {
                this.directions.left  = false
                this.directions.right = true
            }
            if (this.x >= this.npcConfig.movingBounds.bottomRight[0]) {
                this.directions.right = false
                this.directions.left  = true
            }
            if (this.y <= this.npcConfig.movingBounds.upperLeft[1]) {
                this.directions.up   = false
                this.directions.down = true
            }
            if (this.y >= this.npcConfig.movingBounds.bottomRight[1]) {
                this.directions.down = false
                this.directions.up   = true
            }
        }
    }

    moveInARandomDirection() {
        let { vertical, horizontal } = this.getRandomMovement()
        this.lastVerticalDirection   = vertical
        this.lastHorizontalDirection = horizontal
        this.directions              = {
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
        this.directions = new Directions()
    }

    getRandomDirection(directions) {
        return Math.floor(Math.random() * directions.length)
    }
}
