import { Component }                 from '@angular/core'
import { GameEngineService }         from '../../game-engine/game-engine.service'
import { PlayerAttemptedTransition } from '../../../../../../nest/local/map/actions'

@Component({
    selector   : 'action-bar',
    templateUrl: 'action-bar.component.html',
    styleUrls  : ['action-bar.component.scss']
})
export class ActionBarComponent {
    skill = 'skill'

    constructor(private engine: GameEngineService) {
    }

    get canTransition() {
        return this.engine.currentScene && this.engine.currentScene.self && this.engine.currentScene.canTransition[this.engine.currentScene.self.id]
    }

    transition() {
        this.engine.game.events.emit(PlayerAttemptedTransition.event)
    }
}
