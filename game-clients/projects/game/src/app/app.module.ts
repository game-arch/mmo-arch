import {BrowserModule} from '@angular/platform-browser';
import {NgModule}      from '@angular/core';

import {AppComponent}             from './app.component';
import {BrowserAnimationsModule}  from '@angular/platform-browser/animations';
import {HttpClientModule}         from "@angular/common/http";
import {AuthenticationModule}     from "../../../authentication/src/lib/authentication.module";
import {NgxsModule}               from "@ngxs/store";
import {NgxsStoragePluginModule}  from "@ngxs/storage-plugin";
import {ServerSelectionModule}    from "../../../server-selection/src/lib/server-selection.module";
import {CharacterSelectionModule} from "../../../character-selection/src/lib/character-selection.module";
import {ConnectionModule}         from "../../../connection/src/lib/connection.module";

@NgModule({
    declarations: [
        AppComponent
    ],
    imports     : [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        ConnectionModule,
        AuthenticationModule,
        ServerSelectionModule,
        CharacterSelectionModule,
        NgxsModule.forRoot([]),
        NgxsStoragePluginModule.forRoot({
            key: [
                'auth'
            ]
        })
    ],
    providers   : [],
    bootstrap   : [AppComponent]
})
export class AppModule {
}
