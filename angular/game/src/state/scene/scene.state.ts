import { Action, Actions, State, StateContext, Store } from '@ngxs/store'
import { ScenesModel }                                 from './scenes.model'
import {
    AllNpcs,
    AllPlayers,
    MapChannels,
    NpcAdded,
    NpcUpdate,
    PlayerAttemptedTransition,
    PlayerDirections,
    PlayerEnteredMap,
    PlayerLeftMap,
    PlayerTransitionFailed,
    PlayerUpdate
}                                                      from '../../../../../shared/actions/map.actions'
import { Injectable }                                  from '@angular/core'
import { GameEngineService }                           from '../../lib/game-engine/game-engine.service'
import { WorldConnected }                              from '../../../../../shared/actions/connection.actions'
import { ChangeScene }                                 from './scene.actions'
import { Directions }                                  from '../../../../../shared/phaser/directions'
import { MultiplayerScene }                            from '../../lib/game-engine/phaser/scenes/multiplayer.scene'
import { WorldState }                                  from '../world/world.state'
import { WorldModel }                                  from '../world/world.model'
import { first }                                       from 'rxjs/operators'

@State<ScenesModel>({
    name    : 'game',
    defaults: new ScenesModel()
})
@Injectable()
export class SceneState {

    constructor(private store: Store, private actions: Actions, private engine: GameEngineService) {
    }

    @Action(ChangeScene)
    onSceneChange(context: StateContext<ScenesModel>, { scene }: ChangeScene) {
        let state        = context.getState()
        let directions: Directions
        let currentScene = this.engine.getScene(state.current)
        if (currentScene) {
            this.engine.game.scene.stop(state.current)
            if (currentScene instanceof MultiplayerScene) {
                directions = currentScene.directions
                currentScene.destroy()
            }
        }
        this.engine.game.scene.start(scene)
        if (scene === 'preload') {
            scene = 'title'
        }
        this.engine.currentSceneKey = scene
        this.engine.currentScene    = this.engine.getScene(scene) as MultiplayerScene
        if (directions && currentScene instanceof MultiplayerScene) {
            currentScene.directions = directions
            context.dispatch(new PlayerDirections())
        }
        context.patchState({ current: scene })
    }

    @Action(WorldConnected)
    onWorldConnected(context: StateContext<ScenesModel>, action: WorldConnected) {
        action.socket.on(MapChannels.type, (data: MapChannels) => context.dispatch(new MapChannels(data.characterId, data.map, data.channels)))
        action.socket.on(PlayerEnteredMap.type, (data) => {
            context.dispatch(new PlayerEnteredMap(data.id, data.name, data.map, data.channel, data.x, data.y))
        })
        action.socket.on(PlayerLeftMap.type, (data) => context.dispatch(new PlayerLeftMap(data.id, data.name, data.map, data.channel)))
        action.socket.on(AllPlayers.type, (data) => context.dispatch(new AllPlayers(data.map, data.players)))
        action.socket.on(AllNpcs.type, (data) => context.dispatch(new AllNpcs(data.map, data.npcs)))
        action.socket.on(PlayerUpdate.type, (data) => this.onPlayerUpdate(context, new PlayerUpdate(data.map, data.channel, data.player)))
        action.socket.on(NpcUpdate.type, (data) => this.onNpcUpdate(context, new NpcUpdate(data.map, data.channel, data.npc)))
        action.socket.on(NpcAdded.type, (data: NpcAdded) => context.dispatch(new NpcAdded(data.mobId, data.instanceId, data.name, data.map, data.x, data.y)))
    }

    @Action(PlayerAttemptedTransition)
    onPlayerTransition(context: StateContext<ScenesModel>, action: PlayerAttemptedTransition) {
        let world: WorldModel = this.store.selectSnapshot(WorldState)
        world.socket.emit(PlayerAttemptedTransition.type, action, (result) => {
            if (!result.status) {
                context.dispatch(new PlayerTransitionFailed(result.reason))
            }
        })
    }

    @Action(PlayerTransitionFailed)
    onPlayerTransitionFailed(context: StateContext<ScenesModel>, action: PlayerTransitionFailed) {

    }

    @Action(AllNpcs)
    onAllNPCs(context: StateContext<ScenesModel>, action: AllNpcs) {
        let scene = this.engine.getScene(action.map)
        if (scene instanceof MultiplayerScene) {
            if (!scene.physics.world || !scene.layers.mobs) {
                scene.onCreate.pipe(first()).subscribe(() => scene.reloadNpcs(action.npcs))
                return
            }
            scene.reloadNpcs(action.npcs)
        }
    }

    @Action(AllPlayers)
    onAllPlayers(context: StateContext<ScenesModel>, action: AllPlayers) {
        let scene = this.engine.getScene(action.map)
        if (scene instanceof MultiplayerScene) {
            if (!this.engine.game.scene.isActive(action.map)) {
                this.store.dispatch(new ChangeScene(action.map))
            }
            if (!scene.physics.world || !scene.layers.mobs) {
                scene.onCreate.pipe(first()).subscribe(() => scene.reloadPlayers(action.players))
                return
            }
            scene.reloadPlayers(action.players)
        }
    }

    @Action(PlayerDirections)
    onPlayerDirections(context: StateContext<ScenesModel>, action: PlayerDirections) {
        let state = context.getState()
        let scene = this.engine.getScene(state.current)
        if (scene instanceof MultiplayerScene) {
            let world = this.store.selectSnapshot(WorldState)
            world.socket.emit(PlayerDirections.type, new PlayerDirections(world.character, scene.directions))
        }
    }

    onPlayerUpdate(context: StateContext<ScenesModel>, action: PlayerUpdate) {
        let scene = this.engine.getScene(action.map)
        if (scene instanceof MultiplayerScene) {
            if (!scene.physics.world || !scene.layers.mobs) {
                scene.onCreate.pipe(first()).subscribe(() => scene.addOrUpdatePlayer(action.player))
                return
            }
            scene.addOrUpdatePlayer(action.player)
        }
    }

    onNpcUpdate(context: StateContext<ScenesModel>, action: NpcUpdate) {
        let scene = this.engine.getScene(action.map)
        if (scene instanceof MultiplayerScene) {
            if (!scene.physics.world || !scene.layers.mobs) {
                scene.onCreate.pipe(first()).subscribe(() => scene.addOrUpdateNpc(action.npc))
                return
            }
            scene.addOrUpdateNpc(action.npc)
        }
    }

    @Action(NpcAdded)
    onNpcAdded(context: StateContext<ScenesModel>, action: NpcAdded) {
        let scene = this.engine.getScene(action.map)
        if (scene instanceof MultiplayerScene) {
            if (scene instanceof MultiplayerScene) {
                if (!scene.physics.world || !scene.layers.mobs) {
                    scene.onCreate.pipe(first()).subscribe(() => scene.addNpc(action))
                    return
                }
                scene.addNpc(action)
            }
        }
    }

    @Action(PlayerEnteredMap)
    onPlayerEntered(context: StateContext<ScenesModel>, action: PlayerEnteredMap) {
        let scene = this.engine.getScene(action.map)
        if (scene instanceof MultiplayerScene) {
            let world: WorldModel = this.store.selectSnapshot(WorldState)
            if (!scene.physics.world || !scene.layers.mobs) {
                scene.onCreate.pipe(first()).subscribe(() => scene.addOrUpdatePlayer(action))
                return
            }
            scene.addOrUpdatePlayer(action)
        }
    }

    @Action(PlayerLeftMap)
    onPlayerLeft(context: StateContext<ScenesModel>, action: PlayerLeftMap) {
        let scene = this.engine.getScene(action.map)
        if (scene instanceof MultiplayerScene) {
            if (scene.self.instanceId !== action.id) {
                scene.removePlayer(action.id)
            }
        }
    }
}
