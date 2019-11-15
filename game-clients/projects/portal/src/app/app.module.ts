import {BrowserModule} from '@angular/platform-browser';
import {NgModule}      from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent}     from './app.component';
import {SocketIoModule}   from "ngx-socket-io";
import {PORTS}            from "../../../lib/constants";

@NgModule({
    declarations: [
        AppComponent
    ],
    imports     : [
        BrowserModule,
        AppRoutingModule,
        SocketIoModule.forRoot({
            url: 'http://localhost:' +PORTS.ACCOUNT
        })
    ],
    providers   : [],
    bootstrap   : [AppComponent]
})
export class AppModule {
}
