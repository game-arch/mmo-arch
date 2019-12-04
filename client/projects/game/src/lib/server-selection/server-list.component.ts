import {Component, EventEmitter, OnInit} from '@angular/core';
import {EMPTY, fromEvent, Observable}    from "rxjs";
import {ConnectionManager}               from "../connection/connection-manager";
import {GameWorld}                       from "../../../../../../server/lib/interfaces/game-world";
import {map, takeUntil, tap}             from "rxjs/operators";
import {Store}                           from "@ngxs/store";
import {SetToken}                        from "../authentication/state/auth.actions";
import {GetServers}                      from "../../../../../../server/services/presence/actions";

@Component({
    selector   : 'server-list',
    templateUrl: 'server-list.component.html',
    styles     : [],
    outputs    : ['connected']
})
export class ServerListComponent implements OnInit {

    servers$: Observable<GameWorld[]>;

    destroy = new EventEmitter();

    connected = new EventEmitter<string>();

    constructor(private store: Store, public manager: ConnectionManager) {
    }

    ngOnInit() {
        let connection = this.manager.connectToLobby();
        this.servers$  = fromEvent<GameWorld[]>(connection.socket, GetServers.event).pipe(tap(list => {
            console.log("got server list", list);
        }));
    }

    onConnect(world: GameWorld) {
        let connection = this.manager.connectToWorld(world);
        fromEvent(connection.socket, 'connect-error', {once: true})
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
