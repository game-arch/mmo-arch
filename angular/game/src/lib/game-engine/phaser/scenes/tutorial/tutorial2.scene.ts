import { MultiplayerScene }  from '../multiplayer.scene'
import { ConnectionManager } from '../../../../connection/connection-manager'
import { TUTORIAL_2_CONFIG } from '../../../../../../../../shared/maps/tutorial-2'
import Scene = Phaser.Scene

export class Tutorial2Scene extends MultiplayerScene implements Scene {
    constructor(protected manager: ConnectionManager) {
        super(manager, TUTORIAL_2_CONFIG)
    }

    update(time: number, delta: number) {
    }

}
