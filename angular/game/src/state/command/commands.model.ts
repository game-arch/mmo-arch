import {
    BaseCommand,
    MoveDown,
    MoveLeft,
    MoveRight,
    MoveUp,
    OverloadedAction,
    PushOthersCommand,
    ShootArrowCommand
}               from './command.actions'
import { Type } from '@angular/core'

export class CommandsModel {
    mappings: { [key: string]: Type<BaseCommand> } = {
        'ArrowUp'   : MoveUp,
        'ArrowDown' : MoveDown,
        'ArrowRight': MoveRight,
        'ArrowLeft' : MoveLeft,
        '1'         : PushOthersCommand,
        '2'         : ShootArrowCommand,
        ' '         : OverloadedAction
    }
}
