import {BrowserModule} from '@angular/platform-browser';
import {NgModule}      from '@angular/core';

import {AppComponent}            from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SocketIoModule}          from "ngx-socket-io";

@NgModule({
    declarations: [
        AppComponent
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        SocketIoModule.forRoot({
            url: 'http://localhost:3004'
        })
    ],
    providers   : [],
    bootstrap   : [AppComponent]
})
export class AppModule {
}
