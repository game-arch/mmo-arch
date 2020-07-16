import { Action, State, StateContext, Store } from '@ngxs/store'
import { OverloadedAction, PushAreaCommand }  from '../command.actions'
import { SceneState }                         from '../../scene/scene.state'
import { GameEngineService }                       from '../../../lib/game-engine/game-engine.service'
import { MultiplayerScene }                        from '../../../lib/game-engine/phaser/scenes/multiplayer.scene'
import { PlayerAttemptedTransition, PlayerUpdate } from '../../../../../../shared/actions/map.actions'
import { Injectable }                              from '@angular/core'
import { OverloadedModel }                         from '../overloaded.model'

@State<OverloadedModel>({
    name    : 'overloadedAction',
    defaults: new OverloadedModel()
})
@Injectable()
export class OverloadedActionState {
    constructor(private engine: GameEngineService, private store: Store) {
    }

    @Action(PlayerUpdate)
    onPlayerUpdate(context: StateContext<OverloadedModel>, action: PlayerUpdate) {
        let scene = this.getCurrentScene()
        if (scene instanceof MultiplayerScene) {
            if (scene.canTransition[scene.self.instanceId]) {
                context.patchState({ action: 'teleport' })
                return
            }
            context.patchState({ action: 'push' })
        }
    }

    @Action(OverloadedAction)
    onAction(context: StateContext<OverloadedModel>, action: OverloadedAction) {
        let scene = this.getCurrentScene()
        if (scene instanceof MultiplayerScene) {
            if (scene.canTransition[scene.self.instanceId]) {
                context.dispatch(new PlayerAttemptedTransition(scene.self.instanceId))
                return
            }
            context.dispatch(new PushAreaCommand(action.status))
            return
        }
    }

    private getCurrentScene() {
        return this.engine.getScene(this.store.selectSnapshot(SceneState).current)
    }
}
