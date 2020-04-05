import { NgModule }          from '@angular/core'
import { GameEngineService } from './game-engine.service'
import { CommonModule }      from '@angular/common'
import { EventBus }          from './phaser/event-bus'

@NgModule({
    imports     : [
        CommonModule
    ],
    providers   : [GameEngineService, EventBus],
    declarations: [],
    exports     : []
})
export class GameEngineModule {

}
