import { NgModule }              from '@angular/core'
import { SceneStateModule }      from './scene/scene-state.module'
import { ConnectionStateModule } from './connection/connection-state.module'
import { LobbyStateModule }      from './lobby/lobby-state.module'
import { WorldStateModule }      from './world/world-state.module'
import { AuthStateModule }       from './auth/auth-state.module'
import { InputStateModule }      from './input/input-state.module'
import { CommandStateModule }    from './command/command-state.module'

@NgModule({
    imports: [
        AuthStateModule,
        SceneStateModule,
        ConnectionStateModule,
        LobbyStateModule,
        WorldStateModule,
        InputStateModule,
        CommandStateModule
    ],
    exports: [
        AuthStateModule,
        SceneStateModule,
        ConnectionStateModule,
        LobbyStateModule,
        WorldStateModule,
        InputStateModule,
        CommandStateModule
    ]
})
export class GameStateModule {

}
