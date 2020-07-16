import { Mob } from '../phaser/mob'

export class MapOnline {
    static readonly type = '[Map] Online'

    constructor(public map: string, public channel: number) {

    }
}

export class PlayerEnteredMap implements Mob {
    static readonly type = '[Map] Player Entered'
    public mobId: number
    public instanceId: number
    public velX          = 0
    public velY          = 0

    constructor(public id: number,
                public name: string,
                public map: string,
                public channel: number,
                public x: number,
                public y: number
    ) {
        this.mobId      = id
        this.instanceId = id
    }
}

export class PlayerChangedMap {
    static readonly type = '[Map] Player Changed Map'

    constructor(public id: number, public map: string, public newX: number, public newY: number, public channel: number, public entrance?: string) {

    }
}

export class PlayerLeftMap {
    static readonly type = '[Map] Player Left'

    constructor(public id: number, public name: string, public map: string, public channel: number) {

    }
}

export class PlayerAttemptedTransition {
    static readonly type = '[Map] Attempt Transition'

    constructor(public characterId: number) {
    }
}
export class PlayerTransitionFailed {
    static readonly type = '[Map] Transition Failed'

    constructor(public reason:string) {
    }
}

export class AllPlayers {
    static readonly type = '[Map] All Players'

    constructor(public map: string, public players: Mob[]) {

    }
}

export class GetAllPlayers {
    static readonly type = '[Map] Get All Players'

}

export class GetPlayerById {
    static readonly type = '[Map] Get Player Position'

    constructor(public id: number) {

    }
}

export class FindPlayer {
    static readonly type = '[Map] Find Player'

    constructor(public id: number) {
    }
}

export class PlayerUpdate {
    static readonly type = '[Map] Player Update'

    constructor(public map: string, public channel: number, public player: Mob) {

    }
}

export class PlayerDirections {
    static readonly type = '[Map] Player Directions'

    constructor(public id?: number, public directions?: { up: boolean, down: boolean, left: boolean, right: boolean }) {

    }
}

// NPC Events

export class GetAllNpcs {
    static readonly type = '[Map] Get All NPCs'

}

export class AllNpcs {
    static readonly type = '[Map] All NPCs'

    constructor(public map: string, public npcs: Mob[]) {

    }
}

export class NpcAdded implements Mob {
    static readonly type = '[Map] NPC Added'
    public velX          = 0
    public velY          = 0

    constructor(public mobId: number, public instanceId: number, public name: string, public map: string, public x: number, public y: number) {

    }
}


export class NpcUpdate {
    static readonly type = '[Map] NPC Update'

    constructor(public map: string, public channel: number, public npc: Mob) {

    }
}

export class GetMapChannels {
    static readonly type = '[Map] Get Channels'

    constructor(public map: string, public characterId?: number) {
    }
}

export class MapChannels {
    static readonly type = '[Map] Channels'

    constructor(public characterId: number, public map: string, public channels: { channel: number, playerCount: number, playerCapacity: number }[]) {
    }
}

export class GetLeastPopulatedChannel {
    static readonly type = '[Map] Least Populated Channel'

    constructor(public map: string) {
    }
}

export class ChangeMapChannel {
    static readonly type = '[Map] Change Map Channel'

    constructor(public characterId: number, public channel: number) {
    }
}

