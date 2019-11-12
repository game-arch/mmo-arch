import {Component} from '@angular/core';
import {Socket}    from "ngx-socket-io";

@Component({
    selector   : 'app-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss']
})
export class AppComponent {
    title = 'game';

    constructor(socket: Socket) {

    }
}
