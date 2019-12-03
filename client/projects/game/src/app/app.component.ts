import {Component}         from '@angular/core';
import {Observable}        from "rxjs";
import {AuthModel}         from "../../../authentication/src/lib/state/auth.model";
import {Select, Store}     from "@ngxs/store";
import {AuthState}         from "../../../authentication/src/lib/state/auth.state";
import {ConnectionManager} from "../../../connection/src/lib/connection-manager";
import {SetToken}          from "../../../authentication/src/lib/state/auth.actions";

@Component({
    selector   : 'app-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss']
})
export class AppComponent {
    @Select(AuthState)
    auth$: Observable<AuthModel>;

    title = 'game';

    constructor(
        private store: Store,
        public connection: ConnectionManager
    ) {

    }

    logout() {
        this.store.dispatch(new SetToken());
    }
}
