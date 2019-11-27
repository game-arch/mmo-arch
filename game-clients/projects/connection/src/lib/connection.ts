import Socket = SocketIOClient.Socket;
import * as io from "socket.io-client";

export class Connection<T = { name: string }> {

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
