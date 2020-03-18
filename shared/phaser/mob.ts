import {MobSprite} from './mob-sprite'
import Scene = Phaser.Scene

export class Mob {
    id: number
    scene: Scene
    sprite: MobSprite

    x: number
    y: number

    constructor(public name: string = '') {
    }

    create(scene: Phaser.Scene, x: number, y: number, key: string = '') {
        this.sprite = new MobSprite(scene, x, y, key)
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
