import {EventEmitter, Injectable, Injector} from '@angular/core'
import {ConnectionManager}                  from '../connection/connection-manager'
import {GAME_CONFIG}                        from './phaser/config'
import {SceneFactory}                       from './phaser/scenes/scene-factory.service'
import {from, fromEvent}                    from 'rxjs'
import {filter, mergeMap, takeUntil, tap}   from 'rxjs/operators'
import Scene = Phaser.Scene
import {TitleScene}                         from './phaser/scenes/title/title.scene'
import {TutorialScene}                      from './phaser/scenes/tutorial/tutorial.scene'
import {
    AllPlayers,
    PlayerEnteredMap,
    PlayerLeftMap,
    PlayerUpdate,
}                                           from '../../../../../../server/services/map/actions'
import Game = Phaser.Game

@Injectable()
export class GameEngineService {
    game: Game

    private currentSceneKey = 'title'
    private currentScene: Scene
    private destroyed       = new EventEmitter()

    scenes: { title: TitleScene; tutorial: TutorialScene } = {
        title   : null,
        tutorial: null,
    }

    constructor(
        public sceneFactory: SceneFactory,
        public connection: ConnectionManager
    ) {
    }

    onWorldChange() {
        return this.connection.worldChange
                   .pipe(takeUntil(this.destroyed))
                   .pipe(filter(world => !!world.socket))
    }

    init(canvas: HTMLCanvasElement) {
        this.game            = new Game({...GAME_CONFIG, canvas})
        this.scenes.title    = this.sceneFactory.title()
        this.scenes.tutorial = this.sceneFactory.tutorial()
        this.game.scene.add('title', this.scenes.title)
        this.game.scene.add('tutorial', this.scenes.tutorial)
        this.game.scene.start('title')
        fromEvent(window, 'resize')
            .pipe(takeUntil(this.destroyed))
            .subscribe(() =>
                this.game.events.emit(
                    'resize',
                    window.innerWidth,
                    window.innerHeight
                )
            )
        this.game.events.on('game.scene', scene => {
            if (this.currentSceneKey !== '') {
                this.game.scene.stop(this.currentSceneKey)
            }
            this.currentSceneKey = scene
            this.game.scene.start(scene)
            this.currentScene = this.scenes[scene]
        })
        this.onWorldChange()
            .pipe(
                mergeMap(world =>
                    fromEvent(world.socket, PlayerEnteredMap.event)
                        .pipe(tap(event => {
                            this.connection.world = world;
                        }))
                )
            )
            .subscribe(event =>
                this.game.events.emit(PlayerEnteredMap.event, event)
            )
        this.onWorldChange()
            .pipe(
                mergeMap(world => fromEvent(world.socket, PlayerLeftMap.event))
            )
            .subscribe(event =>
                this.game.events.emit(PlayerLeftMap.event, event)
            )
        this.onWorldChange()
            .pipe(mergeMap(world => fromEvent(world.socket, AllPlayers.event)))
            .subscribe(players =>
                this.game.events.emit(AllPlayers.event, players)
            )
        this.onWorldChange()
            .pipe(
                mergeMap(world => fromEvent(world.socket, PlayerUpdate.event))
            )
            .subscribe(data => this.game.events.emit(PlayerUpdate.event, data))
    }

    destroy() {
        this.game.events.emit('destroy')
        this.game.destroy(true)
        this.destroyed.emit()
    }
}
