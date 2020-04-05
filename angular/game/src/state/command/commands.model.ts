import { BaseCommand, MoveDown, MoveLeft, MoveRight, MoveUp, OverloadedAction, PushMobs } from './command.actions'
import { Type }                                                                           from '@angular/core'

export class CommandsModel {
    mappings: { [key: string]: Type<BaseCommand> } = {
        w  : MoveUp,
        s  : MoveDown,
        d  : MoveRight,
        a  : MoveLeft,
        1  : PushMobs,
        ' ': OverloadedAction
    }
}
