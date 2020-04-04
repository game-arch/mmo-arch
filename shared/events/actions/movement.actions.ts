import { CommandAction, PositionArgs } from '../command.events'

export class Push implements CommandAction {
    static readonly event = 'action:push'
    action                = 'push'

    constructor(public characterId: number, public actionArgs?: PositionArgs) {
    }
}
