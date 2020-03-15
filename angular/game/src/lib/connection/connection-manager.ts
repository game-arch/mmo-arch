import { EventEmitter, Injectable }           from '@angular/core'
import { GameWorld }                          from '../../../../../shared/interfaces/game-world'
import { BehaviorSubject, fromEvent }         from 'rxjs'
import { Connection }                         from './connection'
import { Actions, ofActionDispatched, Store } from '@ngxs/store'
import { AuthState }                          from '../authentication/state/auth.state'
import { SetToken }                           from '../authentication/state/auth.actions'
import { filter, takeUntil }                  from 'rxjs/operators'
import { WorldConnection }                    from './world-connection'

@Injectable()
export class ConnectionManager {

    world: WorldConnection                              = new WorldConnection(null, null)
    worldChange                                         = new BehaviorSubject<WorldConnection>(new WorldConnection(null, null))
    disconnect$                                         = new EventEmitter()
    private connections: { [name: string]: Connection } = {}

    constructor(private store: Store, private actions: Actions) {
        this.actions.pipe(ofActionDispatched(SetToken), filter(action => action.token === ''))
            .subscribe(() => {
                this.disconnect$.emit()
            })
    }

    connectTo(server: GameWorld, isWorld: boolean) {
        if (this.connections[server.name]) {
            this.disconnect(server.name)
        }
        if (server.status === 'online') {
            const connection = this.openConnection(server.name, server, 'http://' + server.host + ':' + server.port, isWorld)
            if (isWorld) {
                this.handleConnectionTriggers()
            } else {
                connection.socket.on('connect-error', () => this.store.dispatch(new SetToken()))
            }
            return connection
        }
        return null
    }

    isConnected(name: string) {
        return this.connections.hasOwnProperty(name) && this.connections[name].socket.connected
    }

    get(name: string) {
        if (this.connections.hasOwnProperty(name)) {
            return this.connections[name]
        }
        return null
    }

    disconnect(name: string) {
        const server = this.get(name)
        if (server.socket.connected) {
            server.socket.disconnect()
            server.socket.close()
        }
        if (this.world.world && this.world.world.name === server.world.name) {
            this.world = new WorldConnection(null, null)
            this.worldChange.next(this.world)
        }
    }

    openConnection(name: string, server: Partial<GameWorld>, location: string, isWorld: boolean = false) {
        const token = this.store.selectSnapshot(AuthState).token
        if (isWorld) {
            const worldConnection    = new WorldConnection(server as GameWorld, location, token)
            this.connections[name] = worldConnection
            this.world             = worldConnection
            this.worldChange.next(this.world)
        } else {
            this.connections[name] = new Connection(server, location, token)
        }
        this.handleDisconnectAll(name)
        return this.connections[name]
    }

    private handleConnectionTriggers() {
        this.world.socket.on('connect', () => this.disconnect('lobby'))
        this.world.socket.on('disconnect', (typeOfDisconnect) => {
            if (typeOfDisconnect === 'io client disconnect') {
                if (this.world.world) {
                    this.disconnect(this.world.world.name)
                }
                this.get('lobby').socket.connect()
                this.handleDisconnectAll('lobby')
            }
        })
    }

    private handleDisconnectAll(name: string) {
        this.disconnect$.pipe(takeUntil(fromEvent(this.connections[name].socket, 'disconnect')))
            .subscribe(() => {
                this.connections[name].socket.disconnect()
                this.connections[name].socket.close()
                delete this.connections[name]
                if (this.world.world && this.world.world.name === name) {
                    this.world = new WorldConnection(null, null)
                    this.worldChange.next(this.world)
                }
            })
    }

}
