import {TUTORIAL_CONFIG}  from "../../../../../../../../game-servers/services/map/config/tutorial";
import Scene = Phaser.Scene;
import {MultiplayerScene} from "../multiplayer.scene";
import {WorldConnection}  from "../../../../../../connection/src/lib/world-connection";

export class TutorialScene extends MultiplayerScene implements Scene {

    constructor(protected connection: WorldConnection) {
        super(connection, TUTORIAL_CONFIG);
    }


    update(time: number, delta: number) {
    }


    create() {
        super.create();
    }

}
