import Scene = Phaser.Scene;
import {Physics} from "../config/physics";
import Vector2 = Phaser.Math.Vector2;
import Body = Phaser.Physics.Arcade.Body;
import {Subject} from "rxjs";
import Sprite = Phaser.GameObjects.Sprite;

export class MobSprite extends Sprite {

    moving: { up: boolean, down: boolean, left: boolean, right: boolean };

    body: Body;

    stopListening = new Subject();
    onStartMoving = new Subject();
    onStopMoving  = new Subject();

    constructor(scene: Scene, x: number, y: number, key: string = '') {
        super(scene, x, y, key);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setSize(32, 32);
        this.body.collideWorldBounds = true;
    }

    lastVelocity: Vector2 = new Vector2();

    preUpdate(...args: any[]) {
        let value = this.moving;
        if (value) {
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
            if (velocity.x !== 0 && velocity.y !== 0) {
                velocity.y = parseInt('' + (velocity.y * 0.75));
                velocity.x = parseInt('' + (velocity.x * 0.75));
            }
            this.body.setVelocity(velocity.x, velocity.y);
            if (this.lastVelocity.x === 0 && this.lastVelocity.y === 0 && (velocity.x !== 0 || velocity.y !== 0)) {
                this.onStartMoving.next();
            }
            if (velocity.x === 0 && velocity.y === 0 && (this.lastVelocity.x !== 0 || this.lastVelocity.y !== 0)) {
                this.onStopMoving.next();
            }
            this.lastVelocity = this.body.velocity.clone();
        }
    }
}
