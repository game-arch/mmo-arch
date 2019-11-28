import Body = Phaser.Physics.Arcade.Body;
import {Subject}       from "rxjs";
import {PlayerGraphic} from "./player-graphic";

export class PlayerSprite {

    stopListening: Subject<any>;
    onStartMoving: Subject<any>;
    onStopMoving: Subject<any>;

    graphic: PlayerGraphic;
    _moving: { up: boolean, down: boolean, left: boolean, right: boolean };

    set moving(value: { up: boolean, down: boolean, left: boolean, right: boolean }) {
        this.graphic.moving = value;
    }

    get body() {
        if (!this.graphic) {
            return null;
        }
        return this.graphic.body;
    }

    init(scene: Phaser.Scene, x, y) {
        this.graphic       = new PlayerGraphic(scene, x, y);
        this.stopListening = this.graphic.stopListening;
        this.onStartMoving = this.graphic.onStartMoving;
        this.onStopMoving  = this.graphic.onStopMoving;
    }

}
