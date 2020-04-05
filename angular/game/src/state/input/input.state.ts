import { Action, State, StateContext }            from '@ngxs/store'
import { GameEngineService }                      from '../../lib/game-engine/game-engine.service'
import { ChangeScene }                            from '../scene/scene.actions'
import { MultiplayerScene }                       from '../../lib/game-engine/phaser/scenes/multiplayer.scene'
import { HoldingKey, KeyDown, KeyHeldFor, KeyUp } from './input.actions'
import { Injectable }                             from '@angular/core'
import { InputModel }                             from './input.model'

@State<InputModel>({
    name    : 'input',
    defaults: new InputModel()
})
@Injectable()
export class InputState {

    constructor(private engine: GameEngineService) {
    }

    @Action(ChangeScene)
    onSceneChange(context: StateContext<InputModel>, action: ChangeScene) {
        let scene = this.engine.getScene(action.scene)
        if (scene instanceof MultiplayerScene) {
            scene.input.keyboard.on('keydown', (event: KeyboardEvent) => {
                event.stopImmediatePropagation()
                context.dispatch(new KeyDown(event.key))
            })
            scene.input.keyboard.on('keyup', (event: KeyboardEvent) => {
                event.stopImmediatePropagation()
                context.dispatch(new KeyUp(event.key))
            })
        }
    }

    @Action(KeyDown)
    onKeyDown(context: StateContext<InputModel>, action: KeyDown) {
        let state = context.getState()
        if (!state.keysDown[action.key]) {
            state.keysDown             = { ...state.keysDown }
            state.keysDown[action.key] = new Date()
            context.patchState({ keysDown: state.keysDown })
        } else {
            let duration = new Date().valueOf() - state.keysDown[action.key].valueOf()
            context.dispatch(new HoldingKey(action.key, duration))
        }
    }


    @Action(KeyUp)
    onKeyUp(context: StateContext<InputModel>, action: KeyUp) {
        let state = context.getState()
        if (state.keysDown[action.key]) {
            state.keysDown = { ...state.keysDown }
            let duration   = new Date().valueOf() - state.keysDown[action.key].valueOf()
            context.dispatch(new KeyHeldFor(action.key, duration))
            context.patchState({ keysDown: state.keysDown })
        }
    }

}
