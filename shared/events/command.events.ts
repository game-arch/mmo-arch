export class AttemptCommand {
    static readonly event = 'command.attempt'
}

export class PerformCommand {
    static readonly event = 'command.perform'
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
    x:number
    y:number
}
