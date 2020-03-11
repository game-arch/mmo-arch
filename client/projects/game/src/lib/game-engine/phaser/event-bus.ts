import { GameEngineService } from '../game-engine.service'
import {
    AllPlayers,
    PlayerEnteredMap,
    PlayerLeftMap,
    PlayerUpdate,
}                            from '../../../../../../../server/services/local/map/actions'
import { from }              from 'rxjs'
import { MultiplayerScene }  from './scenes/multiplayer.scene'

export class EventBus {
    constructor(private engine: GameEngineService) {
    }

    listen() {
        this.sceneChangeEvents()
        this.playerPresenceEvents()
        this.playerUpdateEvents()
        this.joystickEvents()
        this.engine.game.events.on('load.progress', (progress: number) => {
            this.engine.loading = progress * 100
        })
        this.engine.game.events.on('load.complete', () => {
            this.engine.loading = 100
            this.engine.game.events.emit('game.scene', 'title')
        })
    }

    private sceneChangeEvents() {
        this.engine.game.events.on('game.scene', scene => {
            if (this.engine.currentScene) {
                this.engine.game.scene.stop(this.engine.currentSceneKey)
                if (this.engine.currentScene.destroy) {
                    this.engine.currentScene.destroy()
                }
            }
            this.engine.game.scene.start(scene)
            if (scene === 'preload') {
                scene = 'title'
            }
            this.engine.currentSceneKey = scene
            this.engine.currentScene    = this.engine.scenes[scene]
            this.keyEvents(this.engine.currentScene)
        })
    }

    private playerUpdateEvents() {
        this.engine.game.events.on(AllPlayers.event, players => {
            from(players).subscribe(
                (player: {
                    id: number
                    name: string
                    x: number
                    y: number
                    moving?: {
                        up: boolean
                        down: boolean
                        left: boolean
                        right: boolean
                    }
                }) => {
                    if (this.engine.currentScene instanceof MultiplayerScene) {
                        this.engine.currentScene.addOrUpdatePlayer(player)
                    }
                },
            )
        })
        this.engine.game.events.on(PlayerUpdate.event, (data: PlayerUpdate) => {
            if (this.engine.currentScene instanceof MultiplayerScene) {
                this.engine.currentScene.addOrUpdatePlayer(data.player)
            }
        })
    }

    private playerPresenceEvents() {
        this.engine.game.events.on(PlayerEnteredMap.event, data => {
            if (this.engine.currentScene instanceof MultiplayerScene) {
                console.log('Player Joined', data)
                this.engine.currentScene.addOrUpdatePlayer({
                    ...data,
                    id: data.characterId,
                })
            }
        })
        this.engine.game.events.on(PlayerLeftMap.event, data => {
            if (this.engine.currentScene instanceof MultiplayerScene) {
                console.log('Player Left', data)
                this.engine.currentScene.removePlayer(data)
            }
        })
    }

    private keyEvents(scene: MultiplayerScene) {
        if (scene instanceof MultiplayerScene) {
            scene.input.keyboard.on('keydown', (event: KeyboardEvent) => {
                scene.toggleDirection(event, true)
            })
            scene.input.keyboard.on('keyup', (event: KeyboardEvent) => {
                scene.toggleDirection(event, false)
            })
        }
    }

    private joystickEvents() {
        this.engine.game.events.on('input.joystick', directions => {
            if (this.engine.currentScene instanceof MultiplayerScene) {
                for (let dir of Object.keys(
                    this.engine.currentScene.directions,
                )) {
                    this.engine.currentScene.directions[dir] = directions[dir]
                }
                this.engine.currentScene.sendDirectionalInput()
            }
        })
    }
}
