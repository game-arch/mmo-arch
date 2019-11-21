import {config}                from "../../lib/config";
import {Events}                from "../../../lib/constants/events";
import * as io                 from "socket.io-client";
import {Socket}                from "socket.io";
import {fromEvent, Observable} from "rxjs";
import {GameWorld}             from "../../../lib/entities/game-world";

export class PresenceClient {
    socket: Socket;

    userConnected$: Observable<{ accountId: number, world: string }>;
    userDisconnected$: Observable<{ accountId: number, world: string }>;
    serverList$: Observable<GameWorld[]>;

    constructor() {
        this.socket            = io('http://' + config.servers.presence.host + ':' + config.servers.presence.port + '?track=false');
        this.userConnected$    = fromEvent(this.socket, Events.USER_CONNECTED);
        this.userDisconnected$ = fromEvent(this.socket, Events.USER_DISCONNECTED);
        this.serverList$       = fromEvent(this.socket, Events.SERVER_LIST);
    }
}
