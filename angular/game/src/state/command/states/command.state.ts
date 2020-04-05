import { Action, State, StateContext }            from '@ngxs/store'
import { Injectable }                             from '@angular/core'
import { HoldingKey, KeyDown, KeyHeldFor, KeyUp } from '../../input/input.actions'
import { CommandsModel }                          from '../commands.model'

@State<CommandsModel>({
    name    : 'command',
    defaults: new CommandsModel()
})
@Injectable()
export class CommandState {


    @Action(KeyDown)
    onKeyDown(context: StateContext<CommandsModel>, action: KeyDown) {
        let state = context.getState()
        if (state.mappings[action.key]) {
            context.dispatch(new (state.mappings[action.key])(true))
        }
    }

    @Action(KeyUp)
    onKeyUp(context: StateContext<CommandsModel>, action: KeyUp) {
        let state = context.getState()
        if (state.mappings[action.key]) {
            context.dispatch(new (state.mappings[action.key])(false))
        }
    }

    @Action(HoldingKey)
    onHoldingKey(context: StateContext<CommandsModel>, action: HoldingKey) {
        let state = context.getState()
        if (state.mappings[action.key]) {
            context.dispatch(new (state.mappings[action.key])(true, action.milliseconds))
        }
    }

    @Action(KeyHeldFor)
    onKeyHeldFor(context: StateContext<CommandsModel>, action: KeyHeldFor) {
        let state = context.getState()
        if (state.mappings[action.key]) {
            context.dispatch(new (state.mappings[action.key])(false, action.milliseconds))
        }
    }
}
