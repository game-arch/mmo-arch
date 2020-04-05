import { BrowserModule }            from '@angular/platform-browser'
import { NgModule }                 from '@angular/core'
import { AppComponent }             from './app.component'
import { BrowserAnimationsModule }  from '@angular/platform-browser/animations'
import { HttpClientModule }         from '@angular/common/http'
import { AuthenticationModule }     from '../lib/authentication/authentication.module'
import { NgxsModule }               from '@ngxs/store'
import { NgxsStoragePluginModule }  from '@ngxs/storage-plugin'
import { ServerSelectionModule }    from '../lib/server-selection/server-selection.module'
import { CharacterSelectionModule } from '../lib/character-selection/character-selection.module'
import { MatButtonModule }          from '@angular/material/button'
import { RouterModule }             from '@angular/router'
import { GameModule }               from '../game/game.module'
import { SvgModule }                from '../lib/svg/svg.module'
import { HudModule }                from '../lib/hud/hud.module'
import { GameStateModule }          from '../state/game-state.module'

@NgModule({
    declarations: [
        AppComponent
    ],
    imports     : [
        RouterModule.forRoot([]),
        BrowserModule,
        HttpClientModule,
        SvgModule,
        BrowserAnimationsModule,
        AuthenticationModule,
        ServerSelectionModule,
        CharacterSelectionModule,
        GameModule,
        NgxsModule.forRoot([]),
        NgxsStoragePluginModule.forRoot({
            key: ['auth']
        }),
        MatButtonModule,
        HudModule,
        GameStateModule
        // NgxsLoggerPluginModule.forRoot()
    ],
    providers   : [],
    bootstrap   : [AppComponent]
})
export class AppModule {
}
