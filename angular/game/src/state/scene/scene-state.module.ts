import { NgModule }         from '@angular/core'
import { NgxsModule }       from '@ngxs/store'
import { SceneService }     from './scene.service'
import { SceneState }       from './scene.state'
import { GameEngineModule } from '../../lib/game-engine/game-engine.module'

@NgModule({
    imports  : [
        GameEngineModule,
        NgxsModule.forFeature([SceneState])
    ],
    providers: [SceneService]
})
export class SceneStateModule {

}
