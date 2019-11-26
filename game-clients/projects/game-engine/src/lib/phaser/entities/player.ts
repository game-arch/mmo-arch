import Arc = Phaser.GameObjects.Arc;
import Scene = Phaser.Scene;

export class Player {

    graphics: Arc;

    constructor(scene: Scene, x, y) {
        this.graphics = scene.add.circle(x, y, 16, 0x00aa00);
    }
}
