export class AttemptAction {
    static readonly event = 'action.attempt'

    constructor(public characterId: number, public action: string, public targetType: 'npc' | 'player', public targetId: number) {
    }
}


export class PerformAction {
    static readonly event = 'action.perform'

    constructor(public characterId: number, public action: string, public targetType: 'npc' | 'player', public targetId: number) {
    }
}

export class PushMob {
    static readonly event = 'action:push'

    constructor(public characterId: number, public targetType: 'npc' | 'player', public targetId: number) {
    }
}
