import { NgModule }         from '@angular/core'
import { NgxsModule }       from '@ngxs/store'
import { InputState }       from './input.state'
import { GameEngineModule } from '../../lib/game-engine/game-engine.module'

@NgModule({
    imports: [
        GameEngineModule,
        NgxsModule.forFeature([InputState])
    ],
    providers: []
})
export class InputStateModule {

}
