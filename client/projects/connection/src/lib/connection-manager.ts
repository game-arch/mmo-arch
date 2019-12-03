import {Injectable}                         from '@angular/core';
import {GameWorld}                          from "../../../../../server/lib/interfaces/game-world";
import {BehaviorSubject}                    from "rxjs";
import {Connection}                         from "./connection";
import {Actions, ofActionDispatched, Store} from "@ngxs/store";
import {AuthState}                          from "../../../authentication/src/lib/state/auth.state";
import {Hosts}                              from "../../../game/src/lib/hosts";
import {SetToken}                           from "../../../authentication/src/lib/state/auth.actions";
import {filter}                             from "rxjs/operators";
import {WorldConnection}                    from "./world-connection";

@Injectable()
export class ConnectionManager {

    private connections: { [name: string]: Connection } = {};

    private _world = new BehaviorSubject<WorldConnection>(new WorldConnection(null, null));

    world$ = this._world.asObservable();

    get world(): WorldConnection {
        return this._world.getValue();
    }

    constructor(private store: Store, private actions: Actions) {
        this.actions.pipe(ofActionDispatched(SetToken), filter(action => action.token === ''))
            .subscribe(() => {
                this._world.next(new WorldConnection(null, null));
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
        if (this.world.socket && this.world.world) {
            this.disconnect(this.world.world.name);
        }
        if (server.status === 'online') {
            if (!this.connections.hasOwnProperty(server.name)) {
                let connection = this.openWorldConnection(server.name, server, 'http://' + server.host + ':' + server.port);
                this.get(server.name).socket.on('connect', () => this.disconnect('lobby'));
                return connection;
            } else {
                this.connections[server.name].socket.connect();
                this._world.next(this.get(server.name) as WorldConnection);
            }
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
            server.socket.close();
        }
        if (this.world.world.name === server.world.name) {
            this._world.next(new WorldConnection(null, null));
        }
    }

    openConnection(name: string, server: { name: string }, location: string) {
        console.log(location);
        let token              = this.store.selectSnapshot(AuthState).token;
        this.connections[name] = new Connection(server, location, token);
    }

    openWorldConnection(name: string, server: GameWorld, location: string) {
        let token              = this.store.selectSnapshot(AuthState).token;
        let worldConnection    = new WorldConnection(server, location, token);
        this.connections[name] = worldConnection;
        this._world.next(worldConnection);
        return worldConnection;
    }

}
