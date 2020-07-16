import { Action, State, StateContext, Store } from '@ngxs/store'
import { Push }                               from '../../../../../../shared/actions/movement.actions'
import { GameEngineService }                  from '../../../lib/game-engine/game-engine.service'
import { SceneState }                         from '../../scene/scene.state'
import { MultiplayerScene }                   from '../../../lib/game-engine/phaser/scenes/multiplayer.scene'
import { PushSprite }                         from '../../../../../../shared/phaser/projectile/push.sprite'
import { PushAreaCommand, PushOthersCommand } from '../command.actions'
import { WorldState }                         from '../../world/world.state'
import { WorldModel }                         from '../../world/world.model'
import { AttemptCommand }                     from '../../../../../../shared/actions/command.actions'
import { Injectable }                         from '@angular/core'
import { PushModel }                          from '../push.model'

@State<PushModel>({
    name    : 'pushAction',
    defaults: new PushModel()
})
@Injectable()
export class PushActionState {

    constructor(private engine: GameEngineService, private store: Store) {
    }

    @Action(Push)
    onPushed(context: StateContext<PushModel>, action: Push) {
        let scene = this.getCurrentScene()
        if (scene instanceof MultiplayerScene) {
            let player = scene.playerSprites[action.characterId]
            if (player) {
                new PushSprite(
                    'player',
                    action.characterId,
                    scene,
                    player.x,
                    player.y,
                    action.actionArgs ? action.actionArgs.x || player.x : player.x,
                    action.actionArgs ? action.actionArgs.y || player.y : player.y
                )
            }
        }
    }


    @Action(PushOthersCommand)
    onPush(context: StateContext<PushModel>, action: PushOthersCommand) {
        if (action.status) {
            let world: WorldModel = this.store.selectSnapshot(WorldState)
            let scene             = this.getCurrentScene()
            if (scene instanceof MultiplayerScene) {
                let sprite = scene.playerSprites[world.character]
                let push   = new Push(world.character, {
                    x: sprite.x + (sprite.facing.x * 100),
                    y: sprite.y + (sprite.facing.y * 100)
                })
                world.socket.emit(AttemptCommand.type, push)
            }
        }
    }

    @Action(PushAreaCommand)
    onPushArea(context: StateContext<PushModel>, action: PushAreaCommand) {
        if (action.status) {
            let world: WorldModel = this.store.selectSnapshot(WorldState)
            let scene             = this.getCurrentScene()
            if (scene instanceof MultiplayerScene) {
                let push = new Push(world.character)
                world.socket.emit(AttemptCommand.type, push)
            }
        }
    }

    private getCurrentScene() {
        return this.engine.getScene(this.store.selectSnapshot(SceneState).current)
    }
}
