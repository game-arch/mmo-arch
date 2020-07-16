import { EventEmitter, Injectable } from '@angular/core'
import { GAME_CONFIG }              from './phaser/config'
import { fromEvent, Observable }    from 'rxjs'
import { takeUntil }                from 'rxjs/operators'
import { MultiplayerScene }  from './phaser/scenes/multiplayer.scene'
import { TUTORIAL_CONFIG }   from '../../../../../shared/maps/tutorial'
import { TUTORIAL_2_CONFIG } from '../../../../../shared/maps/tutorial-2'
import { PreloadScene }      from './phaser/scenes/preload/preload.scene'
import { Location }          from '@angular/common'
import { TitleScene }        from './phaser/scenes/title/title.scene'
import { Select, Store }     from '@ngxs/store'
import { WorldModel }        from '../../state/world/world.model'
import { WorldState }        from '../../state/world/world.state'
import { ChangeScene }       from '../../state/scene/scene.actions'
import Game = Phaser.Game
import { PlayerDirections }  from '../../../../../shared/actions/map.actions'

@Injectable()
export class GameEngineService {
    loading                                                                                            = 0
    game: Game
    currentSceneKey                                                                                    = 'preload'
    currentScene: MultiplayerScene
    mapChannels: { [map: string]: { channel: number, playerCount: number, playerCapacity: number }[] } = {}
    private destroyed                                                                                  = new EventEmitter()

    @Select(WorldState)
    world$: Observable<WorldModel>


    constructor(
        private store: Store,
        private location: Location
    ) {
    }

    init(canvas: HTMLCanvasElement) {
        this.game = new Game({ ...GAME_CONFIG, canvas })
        this.createScenes()
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
                    this.store.dispatch(new PlayerDirections())
                }
            })

        this.game.events.on('load.progress', (progress: number) => {
            this.loading = progress * 100
        })
        this.game.events.on('load.complete', () => {
            this.loading = 100
            this.store.dispatch(new ChangeScene('title'))
        })
    }

    createScenes() {
        this.game.scene.add('preload', new PreloadScene(this.location))
        this.game.scene.add('title', new TitleScene())
        this.game.scene.add('tutorial', new MultiplayerScene(this.store, TUTORIAL_CONFIG))
        this.game.scene.add('tutorial-2', new MultiplayerScene(this.store, TUTORIAL_2_CONFIG))
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
