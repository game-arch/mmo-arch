import Socket = SocketIOClient.Socket;
import {fromEvent, Observable} from "rxjs";
import {Events}                from "../../../../../game-servers/lib/constants/events";
import {GameCharacter}         from "../../../../../game-servers/lib/entities/game-character";

export class Connection<T = { name: string }> {

    characters$: Observable<GameCharacter[]>;

    constructor(public world: T, public socket: Socket) {
        this.characters$ = fromEvent(socket, Events.CHARACTER_LIST);
        if (socket) {
            this.socket.on('reconnect_attempt', () => {
                this.socket['io'].opts.transports = ['websocket'];
            });
        }
    }
}
