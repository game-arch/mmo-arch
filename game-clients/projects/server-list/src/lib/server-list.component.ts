import {Component, EventEmitter, OnInit} from '@angular/core';
import {Socket}                          from "ngx-socket-io";
import {EMPTY, fromEvent, Observable}    from "rxjs";
import {ConnectionManager}               from "../../../connection/src/lib/connection-manager";
import {GameShard}                       from "../../../../../game-servers/lib/entities/game-shard";
import {Events}                          from "../../../../../game-servers/lib/constants/events";
import {Hosts}                           from "../../../game/src/lib/hosts";
import {map, takeUntil}                  from "rxjs/operators";

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

    constructor(public manager: ConnectionManager) {
    }

    ngOnInit() {
        let socket    = this.manager.connectToUrl('lobby', Hosts.LOBBY);
        this.servers$ = fromEvent(socket, Events.SERVER_LIST);
    }

    onConnect(shard: GameShard) {
        let socket = this.manager.connectToShard(shard);
        fromEvent(socket, 'connect', {once: true})
            .pipe(takeUntil(this.destroy))
            .pipe(map(() => shard.name))
            .subscribe(name => this.connected.emit(name));
    }

    ngOnDestroy() {
        this.destroy.emit();
    }

}
