import { GameWorld } from '../interfaces/game-world'


export class ConnectToWorld {
    static readonly type = '[Connection] Connect To World'

    constructor(public world: GameWorld) {
    }
}

export class DisconnectFromWorld {
    static readonly type = '[Connection] Disconnect From World'
}

export class WorldConnected {
    static readonly type = '[Connection] World Connected'

    constructor(public socket: any, public name: string) {
    }
}

export class WorldDisconnected {
    static readonly type = '[Connection] World Disconnected'

}

export class LobbyConnected {
    static readonly type = '[Connection] Lobby Connected'

    constructor(public socket: any) {
    }
}

export class LobbyDisconnected {
    static readonly type = '[Connection] Lobby Disconnected'
}
