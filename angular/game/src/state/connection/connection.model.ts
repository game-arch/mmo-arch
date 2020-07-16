import Socket = SocketIOClient.Socket

export class ConnectionModel {
    token: string
    lobby: Socket
    world: Socket
}
