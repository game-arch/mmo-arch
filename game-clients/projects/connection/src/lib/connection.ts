import Socket = SocketIOClient.Socket;

export class Connection<T = {name:string}> {

    constructor(public shard: T, public socket: Socket) {

    }
}
