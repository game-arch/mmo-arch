import { TUTORIAL_CONFIG }   from "../../../../../../../../../server/services/local/map/config/tutorial";
import { MultiplayerScene }  from "../multiplayer.scene";
import { ConnectionManager } from "../../../../connection/connection-manager";
import Scene = Phaser.Scene;

export class TutorialScene extends MultiplayerScene implements Scene {
    constructor(protected manager: ConnectionManager) {
        super(manager, TUTORIAL_CONFIG);
    }

    update(time: number, delta: number) {
    }

    create() {
        super.create();
    }
}
