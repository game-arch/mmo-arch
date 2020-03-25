import { GameEngineService }                                         from '../game-engine.service'
import { AllPlayers, PlayerEnteredMap, PlayerLeftMap, PlayerUpdate } from '../../../../../../nest/local/map/actions'
import { from }                                                      from 'rxjs'
import { MultiplayerScene }                                          from './scenes/multiplayer.scene'
import { Mob }                                                       from '../../../../../../shared/phaser/mob'

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
            console.log(scene)
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
            this.engine.currentScene    = this.engine.getScene(scene) as MultiplayerScene
            this.keyEvents(this.engine.currentScene)
        })
    }

    private playerUpdateEvents() {
        this.engine.game.events.on(AllPlayers.event, (data: AllPlayers) => {
            from(data.players).subscribe(
                (player: Mob) => {
                    if (this.engine.getScene(data.map) instanceof MultiplayerScene) {
                        this.engine.getScene(data.map).addOrUpdatePlayer(player)
                    }
                }
            )
        })
        this.engine.game.events.on(PlayerUpdate.event, (data: PlayerUpdate) => {
            console.log(data)
            if (this.engine.getScene(data.map) instanceof MultiplayerScene) {
                this.engine.getScene(data.map).addOrUpdatePlayer(data.player)
            }
        })
    }

    private playerPresenceEvents() {
        this.engine.game.events.on(PlayerEnteredMap.event, (data: PlayerEnteredMap) => {
            let scene = this.engine.getScene(data.map)
            if (scene instanceof MultiplayerScene) {
                console.log('Player Joined', data)
                let mob = {
                    id  : data.characterId,
                    name: data.name,
                    x   : data.x,
                    y   : data.y
                }
                console.log(scene, scene.name, data.map)
                scene.addOrUpdatePlayer(mob)
                if (scene.self && scene.self.id === mob.id) {
                    this.engine.game.events.emit('game.scene', data.map)
                }
            }
        })
        this.engine.game.events.on(PlayerLeftMap.event, (data: PlayerLeftMap) => {
            if (this.engine.getScene(data.map) instanceof MultiplayerScene) {
                console.log('Player Left', data)
                this.engine.getScene(data.map).removePlayer(data)
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
                for (const dir of Object.keys(
                    this.engine.currentScene.directions
                )) {
                    this.engine.currentScene.directions[dir] = directions[dir]
                }
                this.engine.currentScene.sendDirectionalInput()
            }
        })
    }
}
