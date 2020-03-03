import { TUTORIAL_CONFIG } from '../../../../../../../../../server/services/map/config/tutorial'
import Scene = Phaser.Scene
import { MultiplayerScene } from '../multiplayer.scene'
import { WorldConnection } from '../../../../connection/world-connection'
import { ConnectionManager } from '../../../../connection/connection-manager'

export class TutorialScene extends MultiplayerScene implements Scene {
    constructor(protected manager: ConnectionManager) {
        super(manager, TUTORIAL_CONFIG)
    }

    update(time: number, delta: number) {}

    create() {
        super.create()
    }
}
