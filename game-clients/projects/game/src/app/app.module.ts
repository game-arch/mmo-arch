import {BrowserModule} from '@angular/platform-browser';
import {NgModule}      from '@angular/core';

import {AppComponent}            from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SocketIoModule}     from "ngx-socket-io";
import {PORTS}               from "../../../lib/constants";
import {ServerListModule}    from "../../../server-list/src/lib/server-list.module";
import { LoginComponent }    from './login/login.component';
import {MatCardModule}       from "@angular/material/card";
import {MatFormFieldModule}  from "@angular/material/form-field";
import {MatInputModule}      from "@angular/material/input";
import {MatButtonModule}     from "@angular/material/button";
import {MatIconModule}       from "@angular/material/icon";
import {ReactiveFormsModule} from "@angular/forms";
import { RegisterComponent } from './register/register.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        RegisterComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        SocketIoModule.forRoot({
            url: 'http://localhost:' + PORTS.LOBBY
        }),
        ServerListModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        ReactiveFormsModule
    ],
    providers   : [],
    bootstrap   : [AppComponent]
})
export class AppModule {
}
