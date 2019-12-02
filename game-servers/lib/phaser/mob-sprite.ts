import Scene = Phaser.Scene;
import {Physics} from "../../src/world/map/config/physics";
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
    stopped               = true;

    preUpdate(...args: any[]) {
        let value = this.moving;
        if (value) {
            let velocity: Vector2 = new Vector2();
            let speed             = Physics.CLIENT_SPEED_BASE * Physics.SPEED_MODIFIER;
            velocity.y            = speed * (Number(value.down) - Number(value.up));
            velocity.x            = speed * (Number(value.right) - Number(value.left));
            if (this.lastVelocity.x !== velocity.x || this.lastVelocity.y !== velocity.y) {
                if (velocity.x !== 0 && velocity.y !== 0) {
                    this.updateDiagonalVelocity(velocity);
                }
                if (velocity.x !== 0 || velocity.y !== 0) {
                    this.reportMoving();
                }
                if (velocity.x === 0 && velocity.y === 0) {
                    this.reportStopped();
                }
                this.lastVelocity = this.body.velocity.clone();
                this.body.setVelocity(velocity.x, velocity.y);
            }
        }
    }

    private reportStopped() {
        if (!this.stopped) {
            this.onStopMoving.next();
            this.stopped = true;
        }
    }

    private reportMoving() {
        if (this.stopped) {
            this.onStartMoving.next();
            this.stopped = false;
        }
    }

    private updateDiagonalVelocity(velocity: Phaser.Math.Vector2) {
        velocity.y = parseInt('' + (velocity.y * 0.75));
        velocity.x = parseInt('' + (velocity.x * 0.75));
    }
}
