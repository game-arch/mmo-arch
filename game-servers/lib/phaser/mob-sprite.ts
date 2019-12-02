import Scene = Phaser.Scene;
import {Physics}    from "../../src/world/map/config/physics";
import Vector2 = Phaser.Math.Vector2;
import Body = Phaser.Physics.Arcade.Body;
import {Subject}    from "rxjs";
import Sprite = Phaser.GameObjects.Sprite;
import {Directions} from "./directions";

export class MobSprite extends Sprite {

    static readonly SPEED = Physics.SPEED_BASE * Physics.SPEED_MODIFIER;

    moving: Directions;
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

    lastVelocity: Vector2 = new Vector2(0, 0);
    stopped               = true;

    preUpdate(...args: any[]) {
        if (!this.moving) {
            return;
        }
        let velocity = MobSprite.getVelocity(this.moving);
        if (!velocity.equals(this.lastVelocity)) {
            this.lastVelocity = this.body.velocity.clone();
            this.reportChangeInMovingStatus(velocity);
            this.body.setVelocity(velocity.x, velocity.y);
        }
    }

    private reportChangeInMovingStatus(velocity) {
        return velocity.equals(new Vector2(0, 0)) ? this.reportStopped() : this.reportMoving();
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

    static getVelocity(value: Directions = {up: false, down: false, left: false, right: false}) {
        let velocity = new Vector2(
            MobSprite.SPEED * (Number(value.right) - Number(value.left)),
            MobSprite.SPEED * (Number(value.down) - Number(value.up))
        );
        if ((value.up || value.down) && (value.left || value.right)) {
            velocity.x = velocity.x * 0.75;
            velocity.y = velocity.y * 0.75;
        }
        return velocity;
    }
}
