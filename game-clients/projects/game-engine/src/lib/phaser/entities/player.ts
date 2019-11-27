import Arc = Phaser.GameObjects.Arc;
import Scene = Phaser.Scene;
import Body = Phaser.Physics.Arcade.Body;
import Vector2 = Phaser.Math.Vector2;
import {Physics} from "../../../../../../../game-servers/src/world/map/config/physics";

export class Player {

    graphics: Arc;

    body: Body;
    _moving: { up: boolean, down: boolean, left: boolean, right: boolean };

    private _moveTo: { moveTo(x, y): void };

    set moving(value: { up: boolean, down: boolean, left: boolean, right: boolean }) {
        this._moving          = value;
        let velocity: Vector2 = new Vector2();
        let speed             = Physics.CLIENT_SPEED_BASE * Physics.SPEED_MODIFIER;
        if (value.up) {
            velocity.y = -speed;
        } else if (value.down) {
            velocity.y = speed;
        }
        if (value.left) {
            velocity.x = -speed;
        } else if (value.right) {
            velocity.x = speed;
        }
        this.body.velocity = velocity;
    }

    constructor(scene: Scene, x, y) {
        this.graphics = scene.add.circle(x, y, 16, 0x00aa00);
        scene.physics.add.existing(this.graphics, false);
        this.body   = this.graphics.body as Body;
        this.body.setFriction(0,0);
        this._moveTo = (scene.plugins.get('rexMoveTo') as any).add(this.graphics, {
            speed         : 32,
            rotateToTarget: false
        });
    }

    moveTo(x,y) {
        this._moveTo.moveTo(x,y);
    }
}
