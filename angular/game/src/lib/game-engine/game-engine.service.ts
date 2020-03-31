import { EventEmitter, Injectable } from '@angular/core'
import { ConnectionManager }        from '../connection/connection-manager'
import { GAME_CONFIG }              from './phaser/config'
import { fromEvent }                from 'rxjs'
import {
    filter,
    takeUntil,
    tap
}                           from 'rxjs/operators'
import {
    AllNpcs,
    AllPlayers,
    NpcAdded,
    NpcRemoved, NpcUpdate,
    PlayerEnteredMap,
    PlayerLeftMap,
    PlayerUpdate
}                           from '../../../../../shared/events/map.events'
import { MultiplayerScene } from './phaser/scenes/multiplayer.scene'
import { WorldConnection }          from '../connection/world-connection'
import { EventBus }                 from './phaser/event-bus'
import { TUTORIAL_CONFIG }          from '../../../../../shared/maps/tutorial'
import { TUTORIAL_2_CONFIG }        from '../../../../../shared/maps/tutorial-2'
import { PreloadScene }             from './phaser/scenes/preload/preload.scene'
import { Location }                 from '@angular/common'
import { TitleScene }               from './phaser/scenes/title/title.scene'
import Game = Phaser.Game

@Injectable()
export class GameEngineService {
    loading           = 0
    game: Game
    currentSceneKey   = 'preload'
    currentScene: MultiplayerScene
    worldChange       = new EventEmitter()
    eventBus          = new EventBus(this)
    private destroyed = new EventEmitter()

    constructor(
        private location: Location,
        public connection: ConnectionManager
    ) {
    }

    init(canvas: HTMLCanvasElement) {
        this.game = new Game({ ...GAME_CONFIG, canvas })
        this.connection.worldChange
            .pipe(takeUntil(this.destroyed))
            .pipe(filter(world => !!world.socket))
            .pipe(tap(world => (this.connection.world = world)))
            .subscribe(world => {
                this.worldChange.emit()
                this.convertEvents(world, [
                    PlayerEnteredMap.event,
                    PlayerLeftMap.event,
                    AllPlayers.event,
                    PlayerUpdate.event,
                    NpcUpdate.event,
                    NpcAdded.event,
                    NpcRemoved.event,
                    AllNpcs.event
                ])
            })
        this.createScenes()
        this.eventBus.listen()
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
        this.game.scene.add('tutorial', new MultiplayerScene(this.connection, TUTORIAL_CONFIG))
        this.game.scene.add('tutorial-2', new MultiplayerScene(this.connection, TUTORIAL_2_CONFIG))
    }

    convertEvent(world: WorldConnection, eventName: string) {
        fromEvent(world.socket, eventName)
            .pipe(takeUntil(this.worldChange))
            .subscribe(event => {
                // console.log(eventName, event)
                this.game.events.emit(eventName, event)
            })
    }

    convertEvents(world: WorldConnection, eventNames: string[]) {
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
