import { CommandAction, PositionArgs } from './command.actions'

export class ShootArrow implements CommandAction {
    static readonly type   = '[Action] Shoot Arrow'
    static readonly action = 'shootArrow'
    action                 = 'shootArrow'

    constructor(public characterId: number, public actionArgs?: PositionArgs) {
    }
}
