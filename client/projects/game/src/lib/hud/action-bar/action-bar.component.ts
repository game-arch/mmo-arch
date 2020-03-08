import { Component } from '@angular/core'
import { GameEngineService } from '../../game-engine/game-engine.service'

@Component({
    selector: 'action-bar',
    templateUrl: 'action-bar.component.html',
    styleUrls: ['action-bar.component.scss'],
})
export class ActionBarComponent {
    skill = 'skill'
    melee = 'melee'
    meleeSize = 'large'

    constructor(private service: GameEngineService) {}
}
