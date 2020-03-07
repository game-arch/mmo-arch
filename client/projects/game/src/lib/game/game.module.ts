import { JoystickModule }   from "./joystick/joystick.module";
import { NgModule }         from "@angular/core";
import { GameComponent }    from "./game.component";
import { CommonModule }     from "@angular/common";
import { MatButtonModule }  from "@angular/material/button";
import { MatCardModule }    from "@angular/material/card";
import { ConnectionModule } from "../connection/connection.module";
import { RouterModule }     from "@angular/router";
import { GameEngineModule } from "../game-engine/game-engine.module";
import { HudModule }        from "../hud/hud.module";

@NgModule({
    declarations: [GameComponent],
    imports: [
        RouterModule,
        CommonModule,
        MatButtonModule,
        MatCardModule,
        ConnectionModule,
        JoystickModule,
        GameEngineModule,
        HudModule
    ],
    exports     : [GameComponent]
})
export class GameModule {
}
