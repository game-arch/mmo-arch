export class AttemptCommand {
    static readonly type = '[Command] Attempt'
}

export class PerformCommand {
    static readonly type = '[Command] Perform'
}

export class CommandAction {
    action: string

    constructor(public characterId: number, public actionArgs?: { [key: string]: any }) {
    }
}

export interface TargetArgs {
    targetId: number
    targetType: 'player' | 'npc'
}

export interface PositionArgs {
    x: number
    y: number
}
