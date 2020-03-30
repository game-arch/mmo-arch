import { Mob } from '../phaser/mob'

export class MapOnline {
    static readonly event = 'map.online'

    constructor(public map: string) {

    }
}

export class PlayerEnteredMap implements Mob {
    static readonly event = 'map.player_entered'
    public mobId: number
    public instanceId: number

    constructor(public id: number, public name: string, public map: string, public x: number, public y: number) {
        this.mobId      = id
        this.instanceId = id
    }
}

export class PlayerChangedMap {
    static readonly event = 'map.player_changed_map'

    constructor(public id: number, public map: string, public newX: number, public newY: number, public entrance?: string) {

    }
}

export class PlayerLeftMap {
    static readonly event = 'map.player_left'

    constructor(public id: number, public name: string, public map: string) {

    }
}

export class PlayerAttemptedTransition {
    static readonly event = 'map.attempt_transition'

    constructor(public characterId: number) {
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

export class PlayerUpdate {
    static readonly event = 'map.player_update'

    constructor(public map: string, public player: Mob) {

    }
}

export class PlayerDirectionalInput {
    static readonly event = 'map.player_directional_input'

    constructor(public id: number, public map: string, public directions: { up: boolean, down: boolean, left: boolean, right: boolean }) {

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

export class NpcDirectionalInput {
    static readonly event = 'map.npc_directional_input'

    constructor(public instanceId: number, public map: string, public directions: { up: boolean, down: boolean, left: boolean, right: boolean }) {

    }
}


export class NpcUpdate {
    static readonly event = 'map.npc_update'

    constructor(public map: string, public npc: Mob) {

    }
}

export class NpcRemoved {
    static readonly event = 'map.npc_removed'

    constructor(public instanceId: number, public map: string) {

    }
}
