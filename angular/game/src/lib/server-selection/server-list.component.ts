import { Component, EventEmitter, OnInit } from '@angular/core'
import { fromEvent, Observable }           from 'rxjs'
import { ConnectionManager }               from '../connection/connection-manager'
import { GameWorld }                       from '../../../../../shared/interfaces/game-world'
import { map, takeUntil }                  from 'rxjs/operators'
import { Store }                           from '@ngxs/store'
import { SetToken }                        from '../authentication/state/auth.actions'
import { GetServers }                      from '../../../../../shared/events/server-presence.events'
import { Hosts }                           from '../hosts'

@Component({
    selector   : 'server-list',
    templateUrl: 'server-list.component.html',
    styles     : [],
    outputs    : ['connected']
})
export class ServerListComponent implements OnInit {

    servers$: Observable<GameWorld[]>

    destroy = new EventEmitter()

    connected = new EventEmitter<string>()

    constructor(private store: Store, public manager: ConnectionManager) {
    }

    ngOnInit() {
        const connection = this.manager.connectTo(Hosts.LOBBY, false)
        this.servers$    = fromEvent<GameWorld[]>(connection.socket, GetServers.event)
    }

    onConnect(world: GameWorld) {
        const connection = this.manager.connectTo(world, true)
        fromEvent(connection.socket, 'connect-error', { once: true })
            .subscribe((err) => {
                console.error(err)
                this.store.dispatch(new SetToken())
            })
        fromEvent(connection.socket, 'connect', { once: true })
            .pipe(takeUntil(this.destroy))
            .pipe(map(() => world.name))
            .subscribe(name => this.connected.emit(name))
    }

    ngOnDestroy() {
        this.destroy.emit()
    }

}
