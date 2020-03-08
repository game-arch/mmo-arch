import { Component, EventEmitter } from '@angular/core'
import { GameEngineService } from '../../../game-engine.service'

@Component({
    selector: 'health',
    templateUrl: 'health.component.html',
    styleUrls: ['health.component.scss'],
})
export class HealthComponent {
    hp

    constructor(private service: GameEngineService) {}
}
