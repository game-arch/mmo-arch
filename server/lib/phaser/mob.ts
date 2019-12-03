import {MobSprite} from "./mob-sprite";
import Scene = Phaser.Scene;

export class Mob {
    scene: Scene;
    sprite: MobSprite;

    x: number;
    y: number;

    get moving() {
        return this.sprite.moving;
    }

    set moving(value: { up: boolean, down: boolean, left: boolean, right: boolean }) {
        this.sprite.moving = value;
    }

    create(scene: Phaser.Scene, x: number, y: number, key: string = '') {
        this.sprite = new MobSprite(scene, x, y, key);
    }

    destroy() {
        this.sprite.destroy(true);
    }

}
