import { Action, State, StateContext, Store } from '@ngxs/store'
import { MultiplayerScene }                   from '../../../lib/game-engine/phaser/scenes/multiplayer.scene'
import { ShootArrow }                         from '../../../../../../shared/actions/battle.actions'
import { ArrowSprite }                        from '../../../../../../shared/phaser/projectile/arrow.sprite'
import { SceneState }                         from '../../scene/scene.state'
import { GameEngineService }                  from '../../../lib/game-engine/game-engine.service'
import { ShootArrowCommand }                  from '../command.actions'
import { WorldModel }                         from '../../world/world.model'
import { WorldState }                         from '../../world/world.state'
import { AttemptCommand }                     from '../../../../../../shared/actions/command.actions'
import { Injectable }                         from '@angular/core'

@State({
    name: 'archery'
})
@Injectable()
export class ArcheryActionState {

    constructor(private engine: GameEngineService, private store: Store) {
    }

    @Action(ShootArrow)
    onArrow(context: StateContext<any>, action: ShootArrow) {
        let scene = this.getCurrentScene()
        if (scene instanceof MultiplayerScene) {
            let player = scene.playerSprites[action.characterId]
            if (player) {
                new ArrowSprite(
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

    @Action(ShootArrowCommand)
    onShoot(context: StateContext<any>, action: ShootArrowCommand) {
        if (action.status) {
            let world: WorldModel = this.store.selectSnapshot(WorldState)
            let scene             = this.getCurrentScene()
            if (scene instanceof MultiplayerScene) {
                let sprite = scene.playerSprites[world.character]
                let shoot  = new ShootArrow(world.character, {
                    x: sprite.x + (sprite.facing.x * 100),
                    y: sprite.y + (sprite.facing.y * 100)
                })
                world.socket.emit(AttemptCommand.type, shoot)
            }
        }
    }

    private getCurrentScene() {
        return this.engine.getScene(this.store.selectSnapshot(SceneState).current)
    }
}
