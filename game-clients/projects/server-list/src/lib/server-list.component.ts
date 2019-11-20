import {Component, EventEmitter, OnInit} from '@angular/core';
import {Socket}                          from "ngx-socket-io";
import {EMPTY, fromEvent, Observable}    from "rxjs";
import {ConnectionManager}               from "../../../connection/src/lib/connection-manager";
import {GameShard}                       from "../../../../../game-servers/lib/entities/game-world";
import {Events}                          from "../../../../../game-servers/lib/constants/events";
import {Hosts}                           from "../../../game/src/lib/hosts";
import {map, takeUntil}                  from "rxjs/operators";
import {Store}                           from "@ngxs/store";
import {SetToken}                        from "../../../authentication/src/lib/state/auth.actions";

@Component({
    selector   : 'server-list',
    templateUrl: 'server-list.component.html',
    styles     : [],
    outputs    : ['connected']
})
export class ServerListComponent implements OnInit {

    servers$: Observable<GameShard[]>;

    destroy = new EventEmitter();

    connected = new EventEmitter<string>();

    constructor(private store: Store, public manager: ConnectionManager) {
    }

    ngOnInit() {
        let connection = this.manager.connectToLobby();
        this.servers$  = fromEvent(connection.socket, Events.SERVER_LIST);
    }

    onConnect(world: GameShard) {
        let connection = this.manager.connectToWorld(world);
        fromEvent(connection.socket, 'connection-error', {once: true})
            .subscribe((err) => {
                console.error(err);
                this.store.dispatch(new SetToken());
            });
        fromEvent(connection.socket, 'connect', {once: true})
            .pipe(takeUntil(this.destroy))
            .pipe(map(() => world.name))
            .subscribe(name => this.connected.emit(name));
    }

    ngOnDestroy() {
        this.destroy.emit();
    }

}
