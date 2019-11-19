import {Injectable}      from '@angular/core';
import * as io           from "socket.io-client";
import Socket = SocketIOClient.Socket;
import {GameShard}       from "../../../../../game-servers/lib/entities/game-shard";
import {BehaviorSubject} from "rxjs";
import {Connection}      from "./connection";

@Injectable()
export class ConnectionManager {

    private connections: { [name: string]: Connection } = {};

    private _world = new BehaviorSubject<Connection>(new Connection({name: ''}, null));

    world$ = this._world.asObservable();

    get world() {
        return this._world.getValue();
    }

    connectToLobby(url: string) {
        if (!this.connections.hasOwnProperty('lobby')) {
            this.connections['lobby'] = new Connection({name: 'lobby'}, io.connect(url));
        }
        return this.get('lobby');
    }

    connectToWorld(server: GameShard) {
        if (this.world) {
            this.world.socket.disconnect();
            delete this.connections[this.world.shard.name];
            this._world.next(null);
        }
        if (server.status === 'online') {
            if (!this.connections.hasOwnProperty(server.name)) {
                this.connections[server.name] = new Connection(server, io.connect('http://' + server.host + ':' + server.port));
                this._world.next(this.connections[server.name]);
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

}
