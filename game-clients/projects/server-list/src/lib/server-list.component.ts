import {Component, OnInit} from '@angular/core';
import {Socket}            from "ngx-socket-io";
import {Observable}        from "rxjs";
import {Server}            from "./server";

@Component({
    selector: 'server-list',
    template: `
        <mat-list *ngIf="servers$ | async as servers">
            <mat-list-item *ngFor="let server of servers">
                <div matLine>{{server.name}}</div>
                <div matLine>{{server.current}} / {{server.capacity}} users</div>
                <div>{{server.status}}</div>
            </mat-list-item>
        </mat-list>
    `,
    styles  : []
})
export class ServerListComponent implements OnInit {

    servers$: Observable<Server[]>;

    constructor(private socket: Socket) {
        this.servers$ = this.socket.fromEvent('servers');
    }

    ngOnInit() {
    }

}
