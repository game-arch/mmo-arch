import Body = Phaser.Physics.Arcade.Body;
import {Subject}       from "rxjs";
import {PlayerGraphic} from "./player-graphic";

export class PlayerSprite {

    stopListening: Subject<any>;
    onStartMoving: Subject<any>;
    onStopMoving: Subject<any>;

    circle: PlayerGraphic;
    _moving: { up: boolean, down: boolean, left: boolean, right: boolean };

    set moving(value: { up: boolean, down: boolean, left: boolean, right: boolean }) {
        this.circle.moving = value;
    }

    get body() {
        if (!this.circle) {
            return null;
        }
        return this.circle.body;
    }

    init(scene: Phaser.Scene, x, y) {
        this.circle        = new PlayerGraphic(scene, x, y);
        this.stopListening = this.circle.stopListening;
        this.onStartMoving = this.circle.onStartMoving;
        this.onStopMoving  = this.circle.onStopMoving;
    }

}
