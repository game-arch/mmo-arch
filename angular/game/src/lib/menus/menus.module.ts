import { NgModule }             from '@angular/core'
import { ChannelMenuComponent } from './channel-menu.component'
import { CommonModule }         from '@angular/common'
import { ConnectionModule }     from '../connection/connection.module'
import { GameEngineModule }     from '../game-engine/game-engine.module'
import { MatCardModule }        from '@angular/material/card'

@NgModule({
    imports     : [
        CommonModule,
        ConnectionModule,
        GameEngineModule,
        MatCardModule
    ],
    declarations: [ChannelMenuComponent],
    exports     : [ChannelMenuComponent]
})
export class MenusModule {

}
