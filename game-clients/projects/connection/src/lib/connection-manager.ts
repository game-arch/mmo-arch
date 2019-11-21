import {Injectable}                         from '@angular/core';
import * as io                              from "socket.io-client";
import Socket = SocketIOClient.Socket;
import {GameWorld}                          from "../../../../../game-servers/lib/entities/game-world";
import {BehaviorSubject}                    from "rxjs";
import {Connection}                         from "./connection";
import {Actions, ofActionDispatched, Store} from "@ngxs/store";
import {AuthState}                          from "../../../authentication/src/lib/state/auth.state";
import {Hosts}                              from "../../../game/src/lib/hosts";
import {SetToken}                           from "../../../authentication/src/lib/state/auth.actions";
import {filter}                             from "rxjs/operators";

@Injectable()
export class ConnectionManager {

    private connections: { [name: string]: Connection } = {};

    private _world = new BehaviorSubject<Connection>(new Connection({name: ''}, null));

    world$ = this._world.asObservable();

    get world() {
        return this._world.getValue();
    }

    constructor(private store: Store, private actions: Actions) {
        this.actions.pipe(ofActionDispatched(SetToken), filter(action => action.token === ''))
            .subscribe(() => {
                this._world.next(new Connection({name: ''}, null));
                Object.keys(this.connections).filter(key => {
                    this.connections[key].socket.disconnect();
                    delete this.connections[key];
                });
            });
    }

    connectToLobby() {
        if (!this.connections.hasOwnProperty('lobby')) {
            this.openConnection('lobby', {name: 'lobby'}, Hosts.LOBBY);
            this.connections['lobby'].socket.on('connect-error', (error) => {
                this.store.dispatch(new SetToken());
            });
            return this.get('lobby');
        }
        this.get('lobby').socket.connect();
        return this.get('lobby');
    }

    connectToWorld(server: GameWorld) {
        if (this.world.socket) {
            this.disconnect(this.world.world.name);
        }
        if (server.status === 'online') {
            if (!this.connections.hasOwnProperty(server.name)) {
                this.openConnection(server.name, server, 'http://' + server.host + ':' + server.port);
                this.get(server.name).socket.on('connect', () => this.disconnect('lobby'));
                this.get(server.name).socket.on('disconnect', () => this.connectToLobby());
            } else {
                this.connections[server.name].socket.connect();
            }
            this._world.next(this.connections[server.name]);
            return this.world;
        }
        return null;
    }

    isConnected(name: string) {
        return this.connections.hasOwnProperty(name) && this.connections[name].socket.connected;
    }

    get(name: string) {
        if (this.connections.hasOwnProperty(name)) {
            return this.connections[name];
        }
        return null;
    }

    disconnect(name: string) {
        let server = this.get(name);
        if (server.socket.connected) {
            server.socket.disconnect();
        }
        if (this.world.world.name === server.world.name) {
            this._world.next(new Connection({name: ''}, null));
        }
    }

    openConnection(name: string, server: { name: string }, location: string) {
        let token              = this.store.selectSnapshot(AuthState).token;
        this.connections[name] = new Connection(server, io.connect(location + '?token=' + token, {transports: ['websocket']}));
    }

}
