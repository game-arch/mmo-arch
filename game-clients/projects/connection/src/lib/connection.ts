import Socket = SocketIOClient.Socket;

export class Connection<T = { name: string }> {

    constructor(public world?: T, public socket?: Socket) {
        if (socket) {
            this.socket.on('reconnect_attempt', () => {
                this.socket['io'].opts.transports = ['websocket'];
            });
        }
    }
}
