import { Component }         from '@angular/core'
import { GameEngineService } from '../game-engine/game-engine.service'
import { Select }            from '@ngxs/store'
import { WorldState }        from '../../state/world/world.state'
import { Observable }        from 'rxjs'
import { WorldModel }        from '../../state/world/world.model'

@Component({
    selector   : 'hud',
    templateUrl: 'hud.component.html',
    styleUrls  : ['hud.component.scss']
})
export class HudComponent {
    @Select(WorldState)
    world$: Observable<WorldModel>

    constructor(public engine: GameEngineService) {
    }
}
