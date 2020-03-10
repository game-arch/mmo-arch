import { Component }         from '@angular/core'
import { ConnectionManager } from '../connection/connection-manager'
import { GameEngineService } from "../game-engine/game-engine.service";

@Component({
    selector: 'hud',
    templateUrl: 'hud.component.html',
    styleUrls: ['hud.component.scss']
})
export class HudComponent {
    constructor(public connection: ConnectionManager, public engine: GameEngineService) {}

    get world() {
        return this.connection.world
    }
}
