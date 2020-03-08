import { JoystickComponent } from './controls/joystick/joystick.component'
import { ButtonComponent } from './controls/button/button.component'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ConnectionModule } from '../../connection/connection.module'
import { SceneFactory } from '../phaser/scenes/scene-factory.service'
import { HealthComponent } from './progress/health/health.component'
import { ExperienceComponent } from './progress/experience/experience.component'
import { ManaComponent } from './progress/mana/mana.component'
import { HudComponent } from './hud.component'
import { ButtonsComponent } from './buttons/buttons.component'
import { FlexLayoutModule } from '@angular/flex-layout'
import { NgxJoystickModule } from 'ngx-joystick'

@NgModule({
    declarations: [
        HudComponent,
        HealthComponent,
        ExperienceComponent,
        ManaComponent,
        ButtonComponent,
        ButtonsComponent,
        JoystickComponent,
    ],
    imports: [
        CommonModule,
        ConnectionModule,
        FlexLayoutModule,
        NgxJoystickModule,
    ],
    providers: [SceneFactory],
    exports: [HudComponent],
})
export class HudModule {}
