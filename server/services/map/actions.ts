export class MapOnline {
    static readonly event = 'map.online';

    constructor() {

    }
}

export class PlayerEnteredMap {
    static readonly event = 'map.player_entered';

    constructor(public characterId: number, public name: string, public map: string, public x: number, public y: number) {

    }
}

export class PlayerChangedMap {
    static readonly event = 'map.player_changed_map';

    constructor(public characterId: number, public map: string, public newX: number, public newY: number) {

    }
}

export class PlayerLeftMap {
    static readonly event = 'map.player_left';

    constructor(public characterId: number, public name: string, public map: string) {

    }
}

export class AllPlayers {
    static readonly event = 'map.all_players';

    constructor(public map: string, public players: { characterId: number, x: number, y: number, moving: { up: boolean, down: boolean, left: boolean, right: boolean } }[]) {

    }
}

export class GetAllPlayers {
    static readonly event = 'map.get_all_players';

    constructor(public map: string) {

    }
}

export class GetPlayerPosition {
    static readonly event = 'map.get_player_position';

    constructor(public characterId:number) {

    }
}

export class PlayerDirectionalInput {
    static readonly event = 'map.player_directional_input';

    constructor(public characterId: number, public map: string, public directions: { up: boolean, down: boolean, left: boolean, right: boolean }) {

    }
}
