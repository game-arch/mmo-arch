import { NgModule }             from '@angular/core'
import { ChannelMenuComponent } from './channel-menu.component'
import { CommonModule }         from '@angular/common'
import { GameEngineModule }     from '../game-engine/game-engine.module'
import { MatCardModule }        from '@angular/material/card'
import { MatIconModule }        from '@angular/material/icon'
import { MatButtonModule }      from '@angular/material/button'

@NgModule({
    imports     : [
        CommonModule,
        GameEngineModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule
    ],
    declarations: [ChannelMenuComponent],
    exports     : [ChannelMenuComponent]
})
export class MenusModule {

}
