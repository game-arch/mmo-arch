import {Injectable}      from '@angular/core';
import * as io           from "socket.io-client";
import Socket = SocketIOClient.Socket;
import {GameShard}       from "../../../../../game-servers/lib/entities/game-shard";
import {BehaviorSubject} from "rxjs";

@Injectable()
export class ConnectionManager {

    private connections: { [name: string]: Socket } = {};

    private _shard$ = new BehaviorSubject<GameShard>(null);

    shard$          = this._shard$.asObservable();

    get shard() {
        return this._shard$.getValue();
    }

    connectToUrl(name: string, url: string) {
        if (!this.connections.hasOwnProperty(name)) {
            this.connections[name] = io.connect(url);
        }
        return this.get(name);
    }

    connectToShard(server: GameShard) {
        if (this.shard) {
            this.connections[this.shard.name].disconnect();
            delete this.connections[this.shard.name];
            this._shard$.next(null);
        }
        if (server.status === 'online') {
            if (!this.connections.hasOwnProperty(server.name)) {
                this._shard$.next(server);
                this.connections[server.name] = io.connect('http://' + server.host + ':' + server.port);
            }
            return this.get(server.name);
        }
        return null;
    }

    isConnected(name: string) {
        return this.connections.hasOwnProperty(name) && this.connections[name].connected;
    }

    get(name: string) {
        if (this.connections.hasOwnProperty(name)) {
            return this.connections[name];
        }
        return null;
    }

}
