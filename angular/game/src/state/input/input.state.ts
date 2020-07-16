import { Action, State, StateContext }            from '@ngxs/store'
import { GameEngineService }                      from '../../lib/game-engine/game-engine.service'
import { ChangeScene }                            from '../scene/scene.actions'
import { MultiplayerScene }                       from '../../lib/game-engine/phaser/scenes/multiplayer.scene'
import { HoldingKey, KeyDown, KeyHeldFor, KeyUp } from './input.actions'
import { Injectable }                             from '@angular/core'
import { InputModel }                             from './input.model'
import { from }                                   from 'rxjs'

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
                this.onKeyDown(context, new KeyDown(event.key))
            })

            scene.input.keyboard.on('keyup', (event: KeyboardEvent) => {
                event.stopImmediatePropagation()
                this.onKeyUp(context, new KeyUp(event.key))
            })
        }
    }

    onKeyDown(context: StateContext<InputModel>, action: KeyDown) {
        let state = context.getState()
        if (!state.keysDown[action.key]) {
            state.keysDown             = { ...state.keysDown }
            state.keysDown[action.key] = new Date()
            context.patchState({ keysDown: state.keysDown })
            context.dispatch(action)
        }

    }


    onKeyUp(context: StateContext<InputModel>, action: KeyUp) {
        let state = context.getState()
        if (state.keysDown[action.key]) {
            state.keysDown = { ...state.keysDown }
            let duration   = new Date().valueOf() - state.keysDown[action.key].valueOf()
            context.dispatch(new KeyHeldFor(action.key, duration))
            delete state.keysDown[action.key]
            context.patchState({ keysDown: state.keysDown })
            context.dispatch(action)
        }
        from(Object.keys(state.keysDown))
            .subscribe(key => {
                let duration = new Date().valueOf() - state.keysDown[key].valueOf()
                if (duration % 1000 === 0) {
                    context.dispatch(new HoldingKey(key, duration))
                }
            })
    }

}
