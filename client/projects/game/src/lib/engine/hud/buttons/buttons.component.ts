import { Component, EventEmitter } from '@angular/core'
import { GameEngineService } from '../../game-engine.service'

@Component({
    selector: 'app-buttons',
    templateUrl: 'buttons.component.html',
})
export class ButtonsComponent {
    skill = 'skill'
    melee = 'melee'
    constructor(private service: GameEngineService) {}
}
