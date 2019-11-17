import {Component, OnInit}       from '@angular/core';
import {Socket}                  from "ngx-socket-io";
import {Observable}              from "rxjs";
import {Events}                  from "../../../../../game-servers/src/lib/events";
import {ServerConnectionManager} from "./server-connection-manager.service";
import {GameShard}               from "../../../../../game-libs/entities/game-shard";

@Component({
    selector: 'server-list',
    template: `
        <mat-nav-list *ngIf="servers$ | async as servers">
            <a mat-list-item *ngFor="let server of servers" (click)="manager.connect(server)">
                <div matLine [style.font-weight]="manager.isConnected(server.name) ? 'bold' : 'inherited'">{{server.name}}</div>
                <div matLine>{{server.current}} / {{server.capacity}} users</div>
                <div>{{server.status}}</div>
            </a>
        </mat-nav-list>
    `,
    styles  : []
})
export class ServerListComponent implements OnInit {

    servers$: Observable<GameShard[]>;

    constructor(private socket: Socket, public manager: ServerConnectionManager) {
        this.servers$ = this.socket.fromEvent(Events.SERVER_LIST);
    }

    ngOnInit() {
    }

}
