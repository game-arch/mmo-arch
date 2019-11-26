export class PlayerEnteredMap {
    static readonly event = 'map.player_entered';

    constructor(public characterId: number, public world: string, public map: string, public x: number, public y: number) {

    }
}
export class PlayerChangedMap {
    static readonly event = 'map.player_changed_map';

    constructor(public characterId: number, public world: string, public map: string, public newX: number, public newY: number) {

    }
}

export class PlayerLeftMap {
    static readonly event = 'map.player_left';

    constructor(public characterId: number, public world: string, public map: string) {

    }
}
