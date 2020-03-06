import { BrowserModule } from "@angular/platform-browser";
import { NgModule }      from "@angular/core";

import { AppComponent }             from "./app.component";
import { BrowserAnimationsModule }  from "@angular/platform-browser/animations";
import { HttpClientModule }         from "@angular/common/http";
import { AuthenticationModule }     from "../lib/authentication/authentication.module";
import { NgxsModule }               from "@ngxs/store";
import { NgxsStoragePluginModule }  from "@ngxs/storage-plugin";
import { ServerSelectionModule }    from "../lib/server-selection/server-selection.module";
import { CharacterSelectionModule } from "../lib/character-selection/character-selection.module";
import { ConnectionModule }         from "../lib/connection/connection.module";
import { MatButtonModule }          from "@angular/material/button";
import { GameEngineModule }         from "../lib/engine/game-engine.module";
import { RouterModule }             from "@angular/router";

@NgModule({
    declarations: [
        AppComponent
    ],
    imports     : [
        RouterModule.forRoot([]),
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        ConnectionModule,
        AuthenticationModule,
        ServerSelectionModule,
        CharacterSelectionModule,
        GameEngineModule,
        NgxsModule.forRoot([]),
        NgxsStoragePluginModule.forRoot({
            key: [
                "auth"
            ]
        }),
        MatButtonModule
    ],
    providers   : [],
    bootstrap   : [AppComponent]
})
export class AppModule {
}
