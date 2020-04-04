import { GameEngineService } from '../game-engine.service'
import {
    AllNpcs,
    AllPlayers,
    NpcAdded,
    NpcUpdate,
    PlayerAttemptedTransition,
    PlayerEnteredMap,
    PlayerLeftMap,
    PlayerUpdate
}                            from '../../../../../../shared/events/map.events'
import { MultiplayerScene }  from './scenes/multiplayer.scene'
import { first }             from 'rxjs/operators'
import { Directions }        from '../../../../../../shared/phaser/directions'
import { Push }              from '../../../../../../shared/events/actions/movement.actions'
import { PushCommand }       from '../../commands/push.command'
import { ConnectionManager } from '../../connection/connection-manager'
import { Subject }           from 'rxjs'

export class EventBus {
    stop = new Subject()

    get world() {
        return this.connection.world.socket
    }

    constructor(private engine: GameEngineService, private connection: ConnectionManager) {
    }

    listen() {
        this.stop.next()
        this.npcEvents()
        this.sceneChangeEvents()
        this.playerPresenceEvents()
        this.playerUpdateEvents()
        this.joystickEvents()
        this.commandEvents()
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
            let directions: Directions
            if (this.engine.currentScene) {
                this.engine.game.scene.stop(this.engine.currentSceneKey)
                if (this.engine.currentScene.destroy) {
                    if (this.engine.currentScene instanceof MultiplayerScene) {
                        directions = this.engine.currentScene.directions
                    }
                    this.engine.currentScene.destroy()
                }
            }
            this.engine.game.scene.start(scene)
            if (scene === 'preload') {
                scene = 'title'
            }
            this.engine.currentSceneKey = scene
            this.engine.currentScene    = this.engine.getScene(scene) as MultiplayerScene
            if (directions && this.engine.currentScene instanceof MultiplayerScene) {
                this.engine.currentScene.directions = directions
                this.engine.currentScene.sendDirectionalInput()
            }
            this.keyEvents(this.engine.currentScene)
        })
    }

    private playerUpdateEvents() {
        this.engine.game.events.on(AllPlayers.event, (data: AllPlayers) => {
            let scene = this.engine.getScene(data.map)
            if (scene instanceof MultiplayerScene) {
                if (!scene.physics.world || !scene.layers.mobs) {
                    scene.onCreate.pipe(first()).subscribe(() => scene.reloadPlayers(data.players))
                    return
                }
                scene.reloadPlayers(data.players)
            }
        })
        this.engine.game.events.on(PlayerUpdate.event, (data: PlayerUpdate) => {
            let scene = this.engine.getScene(data.map)
            if (scene instanceof MultiplayerScene) {
                if (!scene.physics.world || !scene.layers.mobs) {
                    scene.onCreate.pipe(first()).subscribe(() => this.engine.getScene(data.map).addOrUpdatePlayer(data.player))
                    return
                }
                this.engine.getScene(data.map).addOrUpdatePlayer(data.player)
            }
        })
    }

    private playerPresenceEvents() {
        this.engine.game.events.on(PlayerEnteredMap.event, (data: PlayerEnteredMap) => {
            let scene = this.engine.getScene(data.map)
            if (scene instanceof MultiplayerScene) {
                console.log('Player Joined', data)
                let scene = this.engine.getScene(data.map)
                if (scene instanceof MultiplayerScene) {
                    if (!this.engine.game.scene.isActive(data.map)) {
                        if (data.instanceId === this.engine.connection.world.selectedCharacter.id) {
                            this.engine.game.events.emit('game.scene', data.map)
                        }
                    }
                    if (!scene.physics.world || !scene.layers.mobs) {
                        scene.onCreate.pipe(first()).subscribe(() => scene.addOrUpdatePlayer(data))
                        return
                    }
                    scene.addOrUpdatePlayer(data)
                }
            }
        })
        this.engine.game.events.on(PlayerLeftMap.event, (data: PlayerLeftMap) => {
            let scene = this.engine.getScene(data.map)
            if (scene instanceof MultiplayerScene) {
                if (scene.self.instanceId !== data.id) {
                    console.log('Player Left', data)
                    scene.removePlayer(data.id)
                }
            }
        })
    }

    private npcEvents() {
        this.engine.game.events.on(AllNpcs.event, (data: AllNpcs) => {
            let scene = this.engine.getScene(data.map)
            if (scene instanceof MultiplayerScene) {
                if (!scene.physics.world || !scene.layers.mobs) {
                    scene.onCreate.pipe(first()).subscribe(() => scene.reloadNpcs(data.npcs))
                    return
                }
                scene.reloadNpcs(data.npcs)
            }
        })

        this.engine.game.events.on(NpcUpdate.event, (data: NpcUpdate) => {
            let scene = this.engine.getScene(data.map)
            if (scene instanceof MultiplayerScene) {
                if (!scene.physics.world || !scene.layers.mobs) {
                    scene.onCreate.pipe(first()).subscribe(() => this.engine.getScene(data.map).addOrUpdateNpc(data.npc))
                    return
                }
                this.engine.getScene(data.map).addOrUpdateNpc(data.npc)
            }
        })
        this.engine.game.events.on(NpcAdded.event, (data: NpcAdded) => {
            let scene = this.engine.getScene(data.map)
            if (scene instanceof MultiplayerScene) {
                console.log('Npc Added', data)
                let scene = this.engine.getScene(data.map)
                if (scene instanceof MultiplayerScene) {
                    if (!scene.physics.world || !scene.layers.mobs) {
                        scene.onCreate.pipe(first()).subscribe(() => scene.addNpc(data))
                        return
                    }
                    scene.addNpc(data)
                }
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
                if (event.key === ' ') {
                    if (!this.engine.currentScene.transitionToNewMap()) {
                        let characterId = this.engine.currentScene.self.instanceId
                        PushCommand.request(this.world, new Push(characterId))
                    }
                }
                if (event.key === '1') {
                    let characterId = this.engine.currentScene.self.instanceId
                    let sprite      = this.engine.currentScene.playerSprites[characterId]
                    PushCommand.request(this.world, new Push(characterId, {
                        x: sprite.x + (sprite.facing.x * 100),
                        y: sprite.y + (sprite.facing.y * 100)
                    }))
                }

            })
            this.engine.game.events.on(PlayerAttemptedTransition.event, () => {
                this.engine.currentScene.transitionToNewMap()
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

    private commandEvents() {
        PushCommand.handle(this.engine)
    }
}
