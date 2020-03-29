import { NgModule }         from '@angular/core'
import { GameComponent }    from './game.component'
import { CommonModule }     from '@angular/common'
import { MatButtonModule }  from '@angular/material/button'
import { MatCardModule }    from '@angular/material/card'
import { ConnectionModule } from '../lib/connection/connection.module'
import { RouterModule }     from '@angular/router'
import { GameEngineModule } from '../lib/game-engine/game-engine.module'
import { HudModule }        from '../lib/hud/hud.module'


@NgModule({
    declarations: [GameComponent],
    imports     : [
        RouterModule,
        CommonModule,
        MatButtonModule,
        MatCardModule,
        ConnectionModule,
        GameEngineModule,
        HudModule
    ],
    exports     : [GameComponent]
})
export class GameModule {
}
