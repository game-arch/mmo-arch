import {NgModule}            from '@angular/core';
import {GameEngineComponent} from './game-engine.component';
import {CommonModule}        from "@angular/common";
import {MatButtonModule}     from "@angular/material/button";
import {MatCardModule}       from "@angular/material/card";
import {ConnectionModule}    from "../../../connection/src/lib/connection.module";


@NgModule({
    declarations: [GameEngineComponent],
    imports     : [
        CommonModule,
        MatButtonModule,
        MatCardModule,
        ConnectionModule
    ],
    exports     : [GameEngineComponent]
})
export class GameEngineModule {
}
