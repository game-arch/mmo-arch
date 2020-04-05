import { NgModule }              from '@angular/core'
import { MapStateModule }        from './map/map-state.module'
import { ConnectionStateModule } from './connection/connection-state.module'
import { LobbyStateModule }      from './lobby/lobby-state.module'
import { WorldStateModule }      from './world/world-state.module'
import { AuthStateModule }       from './auth/auth-state.module'

@NgModule({
    imports: [
        AuthStateModule,
        MapStateModule,
        ConnectionStateModule,
        LobbyStateModule,
        WorldStateModule
    ],
    exports: [
        AuthStateModule,
        MapStateModule,
        ConnectionStateModule,
        LobbyStateModule,
        WorldStateModule
    ]
})
export class GameStateModule {

}
