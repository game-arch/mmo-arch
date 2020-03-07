import { JoystickComponent } from "./joystick.component";
import { NgModule }          from "@angular/core";
import { CommonModule }      from "@angular/common";
import { ConnectionModule }  from "../../connection/connection.module";
import { SceneFactory }      from "../phaser/scenes/scene-factory.service";
import { NgxJoystickModule } from "ngx-joystick";

@NgModule({
    declarations: [JoystickComponent],
    imports     : [CommonModule, ConnectionModule, NgxJoystickModule],
    providers   : [SceneFactory],
    exports     : [JoystickComponent]
})
export class JoystickModule {
}
