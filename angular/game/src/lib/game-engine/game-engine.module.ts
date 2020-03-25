import { NgModule }          from '@angular/core'
import { GameEngineService } from './game-engine.service'
import { ConnectionModule }  from '../connection/connection.module'
import { CommonModule }      from '@angular/common'

@NgModule({
    imports     : [
        CommonModule,
        ConnectionModule
    ],
    providers   : [GameEngineService],
    declarations: [],
    exports     : []
})
export class GameEngineModule {

}
