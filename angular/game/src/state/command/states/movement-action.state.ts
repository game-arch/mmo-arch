import { Action, State, StateContext, Store }    from '@ngxs/store'
import { MoveDown, MoveLeft, MoveRight, MoveUp } from '../command.actions'
import { SceneState }                            from '../../scene/scene.state'
import { GameEngineService }                     from '../../../lib/game-engine/game-engine.service'
import { Injectable }                            from '@angular/core'
import { PlayerDirections }                      from '../../../../../../shared/actions/map.actions'
import { MultiplayerScene }                      from '../../../lib/game-engine/phaser/scenes/multiplayer.scene'

@State<any>({
    name: 'movementAction'
})
@Injectable()
export class MovementActionState {
    constructor(private engine: GameEngineService, private store: Store) {
    }

    @Action(MoveUp)
    onMoveUp(context: StateContext<any>, action: MoveUp) {
        if (!action.duration) {
            let scene = this.getCurrentScene()
            if (scene instanceof MultiplayerScene) {
                scene.toggleDirection('up', action.status)
                context.dispatch(new PlayerDirections())
            }
        }
    }

    @Action(MoveDown)
    onMoveDown(context: StateContext<any>, action: MoveDown) {
        if (!action.duration) {
            let scene = this.getCurrentScene()
            if (scene instanceof MultiplayerScene) {
                scene.toggleDirection('down', action.status)
                context.dispatch(new PlayerDirections())
            }
        }
    }

    @Action(MoveLeft)
    onMoveLeft(context: StateContext<any>, action: MoveLeft) {
        if (!action.duration) {
            let scene = this.getCurrentScene()
            if (scene instanceof MultiplayerScene) {
                scene.toggleDirection('left', action.status)
                context.dispatch(new PlayerDirections())
            }
        }
    }

    @Action(MoveRight)
    onMoveRight(context: StateContext<any>, action: MoveRight) {
        if (!action.duration) {
            let scene = this.getCurrentScene()
            if (scene instanceof MultiplayerScene) {
                scene.toggleDirection('right', action.status)
                context.dispatch(new PlayerDirections())
            }
        }
    }

    private getCurrentScene() {
        return this.engine.getScene(this.store.selectSnapshot(SceneState).current)
    }
}
