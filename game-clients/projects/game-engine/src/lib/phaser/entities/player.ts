import Arc = Phaser.GameObjects.Arc;
import Scene = Phaser.Scene;
import Body = Phaser.Physics.Arcade.Body;

export class Player {

    graphics: Arc;

    body:Body;

    constructor(scene: Scene, x, y) {
        this.graphics = scene.add.circle(x, y, 16, 0x00aa00);
        scene.physics.add.existing(this.graphics, false);
        this.body = this.graphics.body as Body;
    }
}
