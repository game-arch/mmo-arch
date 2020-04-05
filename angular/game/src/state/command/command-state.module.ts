import { NgModule }              from '@angular/core'
import { NgxsModule }            from '@ngxs/store'
import { GameEngineModule }      from '../../lib/game-engine/game-engine.module'
import { MovementActionState }   from './states/movement-action.state'
import { CommandState }          from './states/command.state'
import { OverloadedActionState } from './states/overloaded-action.state'
import { PushActionState }       from './states/push-action.state'

@NgModule({
    imports: [
        GameEngineModule,
        NgxsModule.forFeature([CommandState, PushActionState, MovementActionState, OverloadedActionState])
    ]
})
export class CommandStateModule {

}
