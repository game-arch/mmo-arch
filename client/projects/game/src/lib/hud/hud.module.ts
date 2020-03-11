import { AvatarComponent }       from './avatar/avatar.component'
import { JoystickComponent }     from './controls/joystick/joystick.component'
import { ActionButtonComponent } from './controls/button/action-button.component'
import { NgModule }              from '@angular/core'
import { CommonModule }          from '@angular/common'
import { ConnectionModule }      from '../connection/connection.module'
import { HudComponent }          from './hud.component'
import { ActionBarComponent }    from './action-bar/action-bar.component'
import { FlexLayoutModule }      from '@angular/flex-layout'
import { NgxJoystickModule }     from 'ngx-joystick'
import { SceneFactory }          from '../game-engine/phaser/scenes/scene-factory.service'
import { BarComponent }          from './progress/bar.component'
import { MatRippleModule }       from '@angular/material/core'
import { SvgModule }             from '../svg/svg.module'
import { PreloaderComponent }    from './preloader.component'
import { MatCardModule }         from '@angular/material/card'

@NgModule({
    declarations: [
        HudComponent,
        ActionButtonComponent,
        ActionBarComponent,
        JoystickComponent,
        BarComponent,
        AvatarComponent,
        PreloaderComponent,
    ],
    imports     : [
        SvgModule,
        MatRippleModule,
        CommonModule,
        ConnectionModule,
        FlexLayoutModule,
        NgxJoystickModule,
        MatCardModule,
    ],
    providers   : [SceneFactory],
    exports     : [HudComponent, PreloaderComponent],
})
export class HudModule {
}
