import { JoystickComponent }     from "./controls/joystick/joystick.component";
import { ActionButtonComponent } from "./controls/button/action-button.component";
import { NgModule }              from "@angular/core";
import { CommonModule }          from "@angular/common";
import { ConnectionModule }      from "../connection/connection.module";
import { HudComponent }        from "./hud.component";
import { ActionBarComponent }  from "./action-bar/action-bar.component";
import { FlexLayoutModule }    from "@angular/flex-layout";
import { NgxJoystickModule }   from "ngx-joystick";
import { SceneFactory }        from "../game-engine/phaser/scenes/scene-factory.service";
import { BarComponent }        from "./progress/bar.component";

@NgModule({
    declarations: [
        HudComponent,
        ActionButtonComponent,
        ActionBarComponent,
        JoystickComponent,
        BarComponent
    ],
    imports     : [
        CommonModule,
        ConnectionModule,
        FlexLayoutModule,
        NgxJoystickModule
    ],
    providers   : [SceneFactory],
    exports     : [HudComponent]
})
export class HudModule {
}
