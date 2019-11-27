export class MapOnline {
    static readonly event = 'map.online';

    constructor() {

    }
}

export class PlayerEnteredMap {
    static readonly event = 'map.player_entered';

    constructor(public characterId: number, public world: string, public name: string, public map: string, public x: number, public y: number) {

    }
}

export class PlayerChangedMap {
    static readonly event = 'map.player_changed_map';

    constructor(public characterId: number, public world: string, public map: string, public newX: number, public newY: number) {

    }
}

export class PlayerLeftMap {
    static readonly event = 'map.player_left';

    constructor(public characterId: number, public world: string, public name: string, public map: string) {

    }
}

export class AllPlayers {
    static readonly event = 'map.all_players';

    constructor(public world: string, public map: string, public players: { characterId: number, x: number, y: number }[]) {

    }
}

export class GetAllPlayers {
    static readonly event = 'map.get_all_players';

    constructor(public world: string, public map: string) {

    }
}

export class PlayerMoved {
    static readonly event = 'map.player_moved';

    constructor(public characterId: number, public world: string, public map: string, public inputs: { x: number, y: number }) {

    }
}
