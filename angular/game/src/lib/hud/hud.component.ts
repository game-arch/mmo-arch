import { Component }         from '@angular/core'
import { GameEngineService } from '../game-engine/game-engine.service'

@Component({
    selector   : 'hud',
    templateUrl: 'hud.component.html',
    styleUrls  : ['hud.component.scss']
})
export class HudComponent {

    constructor(public engine: GameEngineService) {
    }
}
