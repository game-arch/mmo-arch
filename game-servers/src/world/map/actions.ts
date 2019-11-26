export class PlayerEnteredMap {
    static readonly event = 'map.player_entered';

    constructor(public characterId: number, public world: string, public map: string, public x: number, public y: number) {

    }
}

export class PlayerLeftMap {
    static readonly event = 'map.player_left';

    constructor(public characterId: number, public world: string, public map: string) {

    }
}
