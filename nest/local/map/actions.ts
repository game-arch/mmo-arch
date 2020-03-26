import { Mob } from '../../../shared/phaser/mob'

export class MapOnline {
    static readonly event = 'map.online'

    constructor() {

    }
}

export class PlayerEnteredMap implements Mob {
    static readonly event = 'map.player_entered'

    constructor(public id: number, public name: string, public map: string, public x: number, public y: number) {

    }
}

export class PlayerChangedMap {
    static readonly event = 'map.player_changed_map'

    constructor(public id: number, public map: string, public newX: number, public newY: number) {

    }
}

export class PlayerLeftMap {
    static readonly event = 'map.player_left'

    constructor(public id: number, public name: string, public map: string) {

    }
}

export class AllPlayers {
    static readonly event = 'map.all_players'

    constructor(public map: string, public players: Mob[]) {

    }
}

export class GetAllPlayers {
    static readonly event = 'map.get_all_players'

    constructor(public map: string) {

    }
}

export class GetPlayerPosition {
    static readonly event = 'map.get_player_position'

    constructor(public id: number) {

    }
}

export class PlayerUpdate {
    static readonly event = 'map.player_update'

    constructor(public map: string, public player: { id: number, name: string, x: number, y: number, moving: { up: boolean, down: boolean, left: boolean, right: boolean } }) {

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

    constructor(public map: string) {

    }
}

export class AllNpcs {
    static readonly event = 'map.all_npcs'

    constructor(public map: string, public npcs: { id: number, x: number, y: number, moving: { up: boolean, down: boolean, left: boolean, right: boolean } }[]) {

    }
}

export class NewNpcSpawn {
    static readonly event = 'map.new_npc_spawn'

    constructor(public npcId: number, public map: string, public name: string, public x: number, public y: number) {

    }
}

export class NpcDirectionalInput {
    static readonly event = 'map.npc_directional_input'

    constructor(public npcId: number, public map: string, public direction: { up: boolean, down: boolean, left: boolean, right: boolean }) {

    }
}


export class NpcUpdate {
    static readonly event = 'map.npc_update'

    constructor(public map: string, public npc: { id: number, name: string, x: number, y: number, moving: { up: boolean, down: boolean, left: boolean, right: boolean } }) {

    }
}

export class NpcDespawn {
    static readonly event = 'map.npc_despawn'

    constructor(public map: string, public npcId: number) {

    }
}
