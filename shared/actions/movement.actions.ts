import { CommandAction, PositionArgs } from './command.actions'

export class Push implements CommandAction {
    static readonly type   = '[Action] Push'
    static readonly action = 'push'
    action                 = 'push'

    constructor(public characterId: number, public actionArgs?: PositionArgs) {
    }
}
