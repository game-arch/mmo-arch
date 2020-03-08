import { NgModule }         from "@angular/core";
import { HudComponent }     from "./hud.component";
import { StatusComponent }  from "./status.component";
import { MatCardModule }    from "@angular/material/card";
import { CommonModule }     from "@angular/common";
import { GameEngineModule } from "../game-engine/game-engine.module";

@NgModule({
    imports     : [
        MatCardModule,
        CommonModule,
        GameEngineModule
    ],
    declarations: [
        HudComponent,
        StatusComponent
    ],
    exports     : [HudComponent]
})
export class HudModule {

}
