import { Directions } from './directions'
import Vector2 = Phaser.Math.Vector2

export class Physics {
    static readonly SPEED_BASE     = 10
    static readonly SPEED_MODIFIER = 16

    static velocityFromDirections(value: Directions = {
        up   : false,
        down : false,
        left : false,
        right: false
    }, modifier: number                             = 1) {
        return new Vector2(
            Math.round(value.left || value.right ? this.getXVelocity(value) * modifier : 0),
            Math.round(value.up || value.down ? this.getYVelocity(value) * modifier : 0)
        )
    }
    static velocityFromDifference(x,y, destinationX, destinationY) {
        let diffX    = Math.round(destinationX - x)
        let diffY    = Math.round(destinationY - y)
        return Physics.velocityFromDirections({
            right: diffX > 0,
            left : diffX < 0,
            up   : diffY < 0,
            down : diffY > 0
        })
    }

    static angleFromVelocity(x, y) {
        let angle = 0
        if (x > 0) {
            angle = 360 - 90
            if (y > 0) {
                angle = 360 - 45
            }
            if (y < 0) {
                angle = 360 - 135
            }
            return angle
        }
        if (x < 0) {
            angle = 90
            if (y > 0) {
                angle = 45
            }
            if (y < 0) {
                angle = 135
            }
            return angle
        }
        if (y < 0) {
            angle = 180
        }
        if (y > 0) {
            angle = 0
        }
        return angle
    }

    static getYVelocity(value: Directions) {
        return this.SPEED_BASE * this.SPEED_MODIFIER * this.getYAxis(value) * this.getYModifier(value)
    }

    static getXVelocity(value: Directions) {
        return this.SPEED_BASE * this.SPEED_MODIFIER * this.getXAxis(value) * this.getXModifier(value)
    }

    static getYModifier(value: Directions) {
        return (value.left || value.right) ? 0.7 : 1
    }

    static getXModifier(value: Directions) {
        return (value.up || value.down) ? 0.7 : 1
    }

    static getYAxis(value: Directions) {
        return Number(value.down) - Number(value.up)
    }

    static getXAxis(value: Directions) {
        return Number(value.right) - Number(value.left)
    }
}
