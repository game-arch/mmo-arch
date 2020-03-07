import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ConnectionModule } from '../../connection/connection.module'
import { SceneFactory } from '../phaser/scenes/scene-factory.service'
import { HealthComponent } from './progress/health.component'
import { HudComponent } from './hud.component'

@NgModule({
    declarations: [HudComponent, HealthComponent],
    imports: [CommonModule, ConnectionModule],
    providers: [SceneFactory],
    exports: [HudComponent],
})
export class HudModule {}
