import { Component, EventEmitter } from '@angular/core'
import { GameEngineService } from '../../../game-engine.service'

@Component({
    selector: 'mana',
    templateUrl: 'mana.component.html',
})
export class ManaComponent {
    hp

    constructor(private service: GameEngineService) {}
}
