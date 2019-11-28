import Arc = Phaser.GameObjects.Arc;
import Body = Phaser.Physics.Arcade.Body;
import Vector2 = Phaser.Math.Vector2;
import {Physics} from "../config/physics";
import {Subject} from "rxjs";

export class PlayerSprite {

    stopListening = new Subject();
    onStartMoving = new Subject();
    onStopMoving  = new Subject();

    graphics: Arc;
    body: Body;
    _moving: { up: boolean, down: boolean, left: boolean, right: boolean };

    set moving(value: { up: boolean, down: boolean, left: boolean, right: boolean }) {
        this._moving          = value;
        let velocity: Vector2 = new Vector2();
        let previousVelocity  = this.body.velocity;
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
        if (velocity.x !== 0 && velocity.y !== 0) {
            velocity.y = velocity.y * 0.75;
            velocity.x = velocity.x * 0.75;
        }
        this.body.setVelocity(velocity.x, velocity.y);
        if (previousVelocity[0] === 0 && previousVelocity[1] === 0 && (velocity[0] !== 0 || velocity[1] !== 0)) {
            this.onStartMoving.next();
        }
        if (velocity[0] === 0 && velocity[1] === 0 && (previousVelocity[0] !== 0 || previousVelocity[1] !== 0)) {
            this.onStopMoving.next();
        }
    }

    init(scene: Phaser.Scene, x, y) {
        this.graphics = scene.add.circle(x, y, 16, 0x00aa00);
        scene.physics.add.existing(this.graphics);
        this.body                    = this.graphics.body as Body;
        this.body.mass               = 100;
        this.body.isCircle           = true;
        this.body.collideWorldBounds = true;
        this.body.debugShowBody      = true;
        this.body.debugShowVelocity  = true;
    }

}
