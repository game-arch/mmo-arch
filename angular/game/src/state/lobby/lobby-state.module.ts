import { NgModule }   from '@angular/core'
import { NgxsModule } from '@ngxs/store'
import { LobbyState } from './lobby.state'

@NgModule({
    imports: [NgxsModule.forFeature([LobbyState])]
})
export class LobbyStateModule {

}
