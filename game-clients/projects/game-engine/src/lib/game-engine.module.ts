import {NgModule}            from '@angular/core';
import {GameEngineComponent} from './game-engine.component';
import {CommonModule}        from "@angular/common";
import {MatButtonModule}     from "@angular/material/button";
import {MatCardModule}       from "@angular/material/card";
import {ConnectionModule}    from "../../../connection/src/lib/connection.module";
import {TitleScene}          from "./phaser/scenes/title.scene";
import {GameEngineService}   from "./game-engine.service";
import {RouterModule}        from "@angular/router";


@NgModule({
    declarations: [GameEngineComponent],
    imports     : [
        RouterModule,
        CommonModule,
        MatButtonModule,
        MatCardModule,
        ConnectionModule
    ],
    providers   : [
        GameEngineService,
        TitleScene
    ],
    exports     : [GameEngineComponent]
})
export class GameEngineModule {
}
