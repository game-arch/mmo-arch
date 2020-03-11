import { MobSprite } from './mob-sprite'
import Scene = Phaser.Scene

export class Mob {
    id: number
    scene: Scene
    sprite: MobSprite

    x: number
    y: number

    constructor(public name: string = '') {
    }

    get moving() {
        return this.sprite.moving
    }

    set moving(value: {
        up: boolean
        down: boolean
        left: boolean
        right: boolean
    }) {
        this.sprite.moving = value
    }

    create(scene: Phaser.Scene, x: number, y: number, key: string = '') {
        this.sprite = new MobSprite(scene, x, y, key)
    }

    destroy() {
        this.sprite.destroy(true)
    }

    asPayload() {
        return {
            id    : this.id,
            name  : this.name,
            x     : this.x,
            y     : this.y,
            moving: this.sprite.moving,
        }
    }
}
