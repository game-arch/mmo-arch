import { NgModule }         from '@angular/core'
import { GameComponent }    from './game.component'
import { CommonModule }     from '@angular/common'
import { MatButtonModule }  from '@angular/material/button'
import { MatCardModule }    from '@angular/material/card'
import { RouterModule }     from '@angular/router'
import { GameEngineModule } from '../lib/game-engine/game-engine.module'
import { HudModule }        from '../lib/hud/hud.module'
import { MenusModule }      from '../lib/menus/menus.module'

@NgModule({
    declarations: [GameComponent],
    imports     : [
        RouterModule,
        CommonModule,
        MatButtonModule,
        MatCardModule,
        GameEngineModule,
        HudModule,
        MenusModule
    ],
    exports     : [GameComponent]
})
export class GameModule {
}
