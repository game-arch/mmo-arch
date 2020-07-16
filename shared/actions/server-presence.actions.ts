import { GameWorld } from '../interfaces/game-world'

export class ServerPresenceOnline {
    static readonly type = 'presence.online'
}

export class GetWorlds {
    static readonly type = '[Presence] World List'

    constructor(public worlds: GameWorld[]) {
    }
}

export class WorldOnline {
    static readonly type = 'presence.world_online'

    constructor(
        public host: string,
        public port: number,
        public constant: string,
        public name: string,
        public instanceId: number
    ) {

    }
}

export class WorldOffline {
    static readonly type = '[Presence] World Offline'

    constructor(
        public serverId: number
    ) {

    }
}
