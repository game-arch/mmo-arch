import {Component}         from '@angular/core';
import {Socket}            from "ngx-socket-io";
import {Observable}        from "rxjs";
import {AuthModel}         from "../../../authentication/src/lib/state/auth.model";
import {Select}            from "@ngxs/store";
import {AuthState}         from "../../../authentication/src/lib/state/auth.state";
import {ConnectionManager} from "../../../connection/src/lib/connection-manager";

@Component({
    selector   : 'app-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss']
})
export class AppComponent {
    @Select(AuthState)
    auth$: Observable<AuthModel>;

    title = 'game';

    constructor(public connection: ConnectionManager) {

    }
}
