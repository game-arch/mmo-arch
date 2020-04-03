import { Directions } from './directions'
import Vector2 = Phaser.Math.Vector2

export class Physics {
    static readonly SPEED_BASE = 10
    static readonly SPEED_MODIFIER = 16

    static getVelocity(value: Directions = {
        up   : false,
        down : false,
        left : false,
        right: false
    }, modifier: number                  = 1) {
        return new Vector2(Math.round(value.left || value.right ? this.getXVelocity(value) * modifier : 0), Math.round(value.up || value.down ? this.getYVelocity(value) * modifier : 0))
    }

    static getYVelocity(value: Directions) {
        return this.SPEED_BASE * this.SPEED_MODIFIER * this.getYAxis(value) * this.getYModifier(value)
    }

    static getXVelocity(value: Directions) {
        return this.SPEED_BASE * this.SPEED_MODIFIER * this.getXAxis(value) * this.getXModifier(value)
    }

    static getYModifier(value: Directions) {
        return (value.left || value.right) ? 0.8 : 1
    }

    static getXModifier(value: Directions) {
        return (value.up || value.down) ? 0.8 : 1
    }

    static getYAxis(value: Directions) {
        return Number(value.down) - Number(value.up)
    }

    static getXAxis(value: Directions) {
        return Number(value.right) - Number(value.left)
    }
}
