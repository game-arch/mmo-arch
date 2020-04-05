import { EventEmitter, Injectable } from '@angular/core'
import { GAME_CONFIG }              from './phaser/config'
import { fromEvent, Observable }    from 'rxjs'
import { filter, takeUntil }        from 'rxjs/operators'
import {
    AllNpcs,
    AllPlayers,
    NpcAdded,
    NpcUpdate,
    PlayerAttemptedTransition,
    PlayerDirections,
    PlayerEnteredMap,
    PlayerLeftMap,
    PlayerUpdate
}                                   from '../../../../../shared/actions/map.actions'
import { MultiplayerScene }         from './phaser/scenes/multiplayer.scene'
import { TUTORIAL_CONFIG }          from '../../../../../shared/maps/tutorial'
import { TUTORIAL_2_CONFIG }        from '../../../../../shared/maps/tutorial-2'
import { PreloadScene }             from './phaser/scenes/preload/preload.scene'
import { Location }                 from '@angular/common'
import { TitleScene }               from './phaser/scenes/title/title.scene'
import { Push }                     from '../../../../../shared/actions/movement.actions'
import { Select, Store }            from '@ngxs/store'
import { WorldModel }               from '../../state/world/world.model'
import { WorldState }               from '../../state/world/world.state'
import { Directions }               from '../../../../../shared/phaser/directions'
import Game = Phaser.Game

@Injectable()
export class GameEngineService {
    loading                                                                                            = 0
    game: Game
    currentSceneKey                                                                                    = 'preload'
    currentScene: MultiplayerScene
    worldChange                                                                                        = new EventEmitter()
    mapChannels: { [map: string]: { channel: number, playerCount: number, playerCapacity: number }[] } = {}
    private destroyed                                                                                  = new EventEmitter()

    static EVENTS = [
        PlayerEnteredMap.type,
        PlayerLeftMap.type,
        AllPlayers.type,
        PlayerUpdate.type,
        NpcUpdate.type,
        NpcAdded.type,
        AllNpcs.type,
        Push.type
    ]
    @Select(WorldState)
    world$: Observable<WorldModel>

    onAttemptTransition = () => {
        let world = this.store.selectSnapshot(WorldState)
        world.socket.emit(PlayerAttemptedTransition.type, {})
    }

    onDirectionChange    = (directions: Directions) => {
        let world = this.store.selectSnapshot(WorldState)
        world.socket.emit(PlayerDirections.type, new PlayerDirections(world.character, directions))
    }
    getSelectedCharacter = () => {
        let world = this.store.selectSnapshot(WorldState)
        return world.character
    }


    constructor(
        private store: Store,
        private location: Location
    ) {
    }

    init(canvas: HTMLCanvasElement) {
        this.game = new Game({ ...GAME_CONFIG, canvas })
        this.createScenes()
        this.world$.pipe(takeUntil(this.destroyed))
            .pipe(filter(world => !!world.socket))
            .subscribe(world => {
                this.worldChange.emit()
                this.convertEvents(world, GameEngineService.EVENTS)
            })
        fromEvent(window, 'resize')
            .pipe(takeUntil(this.destroyed))
            .subscribe(() =>
                this.game.events.emit(
                    'resize',
                    window.innerWidth,
                    window.innerHeight
                )
            )

        fromEvent(window, 'blur')
            .pipe(takeUntil(this.destroyed))
            .subscribe(() => {
                if (this.currentScene instanceof MultiplayerScene) {
                    this.currentScene.directions = {
                        up   : false,
                        down : false,
                        right: false,
                        left : false
                    }
                    this.currentScene.sendDirectionalInput()
                }
            })
    }

    createScenes() {
        this.game.scene.add('preload', new PreloadScene(this.location))
        this.game.scene.add('title', new TitleScene())
        let tutorial                     = new MultiplayerScene(TUTORIAL_CONFIG)
        let tutorial2                    = new MultiplayerScene(TUTORIAL_2_CONFIG)
        tutorial.onAttemptedTransition   = this.onAttemptTransition
        tutorial.onDirectionChange       = this.onDirectionChange
        tutorial.getSelectedCharacterId  = this.getSelectedCharacter
        tutorial2.onAttemptedTransition  = this.onAttemptTransition
        tutorial2.onDirectionChange      = this.onDirectionChange
        tutorial2.getSelectedCharacterId = this.getSelectedCharacter
        this.game.scene.add('tutorial', tutorial)
        this.game.scene.add('tutorial-2', tutorial2)
    }

    convertEvent(world: WorldModel, eventName: string) {
        fromEvent(world.socket, eventName)
            .pipe(takeUntil(this.worldChange))
            .subscribe(event => {
                this.game.events.emit(eventName, event)
            })
    }

    convertEvents(world: WorldModel, eventNames: string[]) {
        for (const eventName of eventNames) {
            this.convertEvent(world, eventName)
        }
    }

    destroy() {
        this.game.events.emit('destroy')
        this.game.destroy(true)
        this.destroyed.emit()
    }

    getScene(scene: string) {
        return this.game.scene.getScene(scene) as MultiplayerScene
    }
}
