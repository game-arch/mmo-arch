import {BrowserModule} from '@angular/platform-browser';
import {NgModule}      from '@angular/core';

import {AppComponent}            from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SocketIoModule}          from "ngx-socket-io";
import {PORTS}                   from "../../../lib/constants";
import {ServerListModule}        from "../../../server-list/src/lib/server-list.module";

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        SocketIoModule.forRoot({
            url: 'http://localhost:' + PORTS.LOBBY
        }),
        ServerListModule
    ],
    providers   : [],
    bootstrap   : [AppComponent]
})
export class AppModule {
}
