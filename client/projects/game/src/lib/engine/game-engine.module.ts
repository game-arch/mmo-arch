import {NgModule}            from '@angular/core';
import {GameEngineComponent} from './game-engine.component';
import {CommonModule}        from "@angular/common";
import {MatButtonModule}     from "@angular/material/button";
import {MatCardModule}       from "@angular/material/card";
import {ConnectionModule}    from "../connection/connection.module";
import {GameEngineService}   from "./game-engine.service";
import {RouterModule}        from "@angular/router";
import {SceneFactory}        from "./phaser/scenes/scene-factory.service";
import {NgxJoystickModule}   from "ngx-joystick";
import {JoystickComponent}   from "./joystick.component";


@NgModule({
    declarations: [GameEngineComponent, JoystickComponent],
    imports     : [
        RouterModule,
        CommonModule,
        MatButtonModule,
        MatCardModule,
        ConnectionModule,
        NgxJoystickModule
    ],
    providers   : [
        GameEngineService,
        SceneFactory
    ],
    exports     : [GameEngineComponent]
})
export class GameEngineModule {
}
