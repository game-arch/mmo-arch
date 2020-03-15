import { Component }         from '@angular/core'
import { GameEngineService } from '../game-engine/game-engine.service'

@Component({
    selector   : 'preloader',
    templateUrl: 'preloader.component.html'
})
export class PreloaderComponent {

    constructor(public engine: GameEngineService) {

    }
}
