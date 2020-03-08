import { NgModule }          from "@angular/core";
import { GameEngineService } from "./game-engine.service";
import { SceneFactory }      from "./phaser/scenes/scene-factory.service";
import { ConnectionModule }  from "../connection/connection.module";
import { CommonModule }      from "@angular/common";

@NgModule({
    imports: [
        CommonModule,
        ConnectionModule,
    ],
    providers   : [GameEngineService, SceneFactory],
    declarations: [],
    exports: []
})
export class GameEngineModule {

}
