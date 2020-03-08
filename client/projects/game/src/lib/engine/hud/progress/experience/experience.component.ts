import { Component, EventEmitter } from '@angular/core'
import { GameEngineService } from '../../../game-engine.service'

@Component({
    selector: 'experience',
    templateUrl: 'experience.component.html',
})
export class ExperienceComponent {
    exp: any

    constructor(private service: GameEngineService) {}
}
