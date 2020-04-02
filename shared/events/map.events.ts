import { Mob } from '../phaser/mob'

export class MapOnline {
    static readonly event = 'map.online'

    constructor(public map: string, public channel: number) {

    }
}

export class PlayerEnteredMap implements Mob {
    static readonly event = 'map.player_entered'
    public mobId: number
    public instanceId: number

    constructor(public id: number, public name: string, public map: string, public channel: number, public x: number, public y: number) {
        this.mobId      = id
        this.instanceId = id
    }
}

export class PlayerChangedMap {
    static readonly event = 'map.player_changed_map'

    constructor(public id: number, public map: string, public newX: number, public newY: number, public channel: number, public entrance?: string) {

    }
}

export class PlayerLeftMap {
    static readonly event = 'map.player_left'

    constructor(public id: number, public name: string, public map: string, public channel: number) {

    }
}

export class PlayerAttemptedTransition {
    static readonly event = 'map.attempt_transition'

    constructor(public characterId: number, public channel: number) {
    }
}

export class AllPlayers {
    static readonly event = 'map.all_players'

    constructor(public map: string, public players: Mob[]) {

    }
}

export class GetAllPlayers {
    static readonly event = 'map.get_all_players'

}

export class GetPlayerPosition {
    static readonly event = 'map.get_player_position'

    constructor(public id: number) {

    }
}

export class FindPlayer {
    static readonly event = 'map.find_player'

    constructor(public id:number) {
    }
}

export class PlayerUpdate {
    static readonly event = 'map.player_update'

    constructor(public map: string, public channel: number, public player: Mob) {

    }
}

export class PlayerDirectionalInput {
    static readonly event = 'map.player_directional_input'

    constructor(public id: number, public directions: { up: boolean, down: boolean, left: boolean, right: boolean }) {

    }
}

// NPC Events

export class GetAllNpcs {
    static readonly event = 'map.get_all_npcs'

}

export class AllNpcs {
    static readonly event = 'map.all_npcs'

    constructor(public map: string, public npcs: Mob[]) {

    }
}

export class NpcAdded implements Mob {
    static readonly event = 'map.npc_added'

    constructor(public mobId: number, public instanceId: number, public name: string, public map: string, public x: number, public y: number) {

    }
}


export class NpcUpdate {
    static readonly event = 'map.npc_update'

    constructor(public map: string, public channel: number, public npc: Mob) {

    }
}

export class NpcRemoved {
    static readonly event = 'map.npc_removed'

    constructor(public instanceId: number, public map: string, public channel: number) {

    }
}

export class GetMapChannels {
    static readonly event = 'map.get_channels'

    constructor(public map: string, public characterId?:number) {
    }
}

export class MapChannels {
    static readonly event = 'map.channels'

    constructor(public characterId: number, public map: string, public channels: { channel: number, playerCount: number, playerCapacity: number }[]) {
    }
}

export class GetLeastPopulatedChannel {
    static readonly event = 'map.least_populated_channel'

    constructor(public map: string) {
    }
}

export class ChangeMapChannel {
    static readonly event = 'map.change_map_channel'

    constructor(public characterId: number, public channel: number) {
    }
}

