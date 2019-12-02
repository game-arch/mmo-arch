import {Directions} from "./directions";
import Vector2 = Phaser.Math.Vector2;

export class Physics {
    static readonly SPEED_BASE     = 10;
    static readonly SPEED_MODIFIER = 16;

    static getVelocity(value: Directions = {up: false, down: false, left: false, right: false}) {
        return new Vector2(this.getXVelocity(value), this.getYVelocity(value));
    }

    private static getYVelocity(value: Directions) {
        return this.SPEED_BASE * this.SPEED_MODIFIER * this.getYAxis(value) * this.getYModifier(value);
    }

    private static getXVelocity(value: Directions) {
        return this.SPEED_BASE * this.SPEED_MODIFIER * this.getXAxis(value) * this.getXModifier(value);
    }

    private static getYModifier(value: Directions) {
        return (value.left || value.right) ? 0.75 : 1;
    }

    private static getXModifier(value: Directions) {
        return (value.up || value.down) ? 0.75 : 1;
    }

    private static getYAxis(value: Directions) {
        return Number(value.down) - Number(value.up);
    }

    private static getXAxis(value: Directions) {
        return Number(value.right) - Number(value.left);
    }
}
