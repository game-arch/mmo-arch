import Socket = SocketIOClient.Socket;
import * as io     from "socket.io-client";
import {GameWorld} from "../../../../../../server/lib/interfaces/game-world";

export class Connection<T = Partial<GameWorld>> {

    socket: Socket;

    constructor(public world?: T, public location?: string, public token ?: string) {
        if (location) {
            this.socket = io.connect(location + '?token=' + token, {
                transports  : ['websocket'],
                reconnection: true
            });
            if (this.socket) {
                this.socket.on('reconnect_attempt', () => {
                    this.socket['io'].opts.transports = ['websocket'];
                });
            }
        }
    }
}
