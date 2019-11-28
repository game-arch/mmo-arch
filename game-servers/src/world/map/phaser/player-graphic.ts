import Arc = Phaser.GameObjects.Arc;
import Scene = Phaser.Scene;
import {Physics} from "../config/physics";
import Vector2 = Phaser.Math.Vector2;
import Body = Phaser.Physics.Arcade.Body;
import {Subject} from "rxjs";
import Sprite = Phaser.GameObjects.Sprite;

export class PlayerGraphic extends Sprite {

    moving: { up: boolean, down: boolean, left: boolean, right: boolean };

    body: Body;

    stopListening = new Subject();
    onStartMoving = new Subject();
    onStopMoving  = new Subject();

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, '');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setSize(32, 32);
        this.body.collideWorldBounds = true;
        this.body.debugShowBody      = true;
        this.body.debugShowVelocity  = true;
    }

    preUpdate(...args: any[]) {
        let value             = this.moving;
        if (value) {
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
                velocity.y = parseInt('' + (velocity.y * 0.75));
                velocity.x = parseInt('' + (velocity.x * 0.75));
            }
            this.body.setVelocity(velocity.x, velocity.y);
            if (previousVelocity[0] === 0 && previousVelocity[1] === 0 && (velocity[0] !== 0 || velocity[1] !== 0)) {
                this.onStartMoving.next();
            }
            if (velocity[0] === 0 && velocity[1] === 0 && (previousVelocity[0] !== 0 || previousVelocity[1] !== 0)) {
                this.onStopMoving.next();
            }
        }
    }
}
