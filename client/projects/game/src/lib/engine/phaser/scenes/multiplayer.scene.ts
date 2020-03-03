import { BaseScene } from '../../../../../../../../server/services/map/maps/base.scene'
import Scene = Phaser.Scene
import { Mob } from '../../../../../../../../server/lib/phaser/mob'
import { EventEmitter } from '@angular/core'
import { MapConfig } from '../../../../../../../../server/services/map/config/config'
import {
    AllPlayers,
    PlayerDirectionalInput,
    PlayerEnteredMap,
    PlayerLeftMap,
    PlayerUpdate,
} from '../../../../../../../../server/services/map/actions'
import { from } from 'rxjs'
import { ConnectionManager } from '../../../connection/connection-manager'

export class MultiplayerScene extends BaseScene implements Scene {
    self: Mob

    destroyed = new EventEmitter()

    get connection() {
        return this.manager.world
    }

    constructor(protected manager: ConnectionManager, config: MapConfig) {
        super(config)
    }

    create() {
        super.create()
        this.game.events.once('game.scene', () => this.destroyed.emit())
        this.game.events.on(PlayerEnteredMap.event, data => {
            console.log('Player Joined', data)
            this.addOrUpdatePlayer({ ...data, id: data.characterId })
        })
        this.game.events.on(PlayerLeftMap.event, data => {
            console.log('Player Left', data)
            this.removePlayer(data)
        })
        this.game.events.on(AllPlayers.event, players => {
            from(players).subscribe(
                (player: {
                    id: number
                    x: number
                    y: number
                    moving?: {
                        up: boolean
                        down: boolean
                        left: boolean
                        right: boolean
                    }
                }) => this.addOrUpdatePlayer(player)
            )
        })
        this.game.events.on(PlayerUpdate.event, (data: PlayerUpdate) => {
            this.addOrUpdatePlayer(data.player)
        })
    }

    private removePlayer(data: PlayerLeftMap) {
        this.removeEntity('player', data.characterId)
    }

    private addOrUpdatePlayer(data: {
        id: number
        x: number
        y: number
        moving?: { up: boolean; down: boolean; left: boolean; right: boolean }
    }) {
        let player = this.entities.player[data.id]
        if (!player) {
            player = this.createPlayer(data)
        }
        player.sprite.setPosition(data.x, data.y)
        if (data.moving) {
            player.moving = data.moving
        }
    }

    private createPlayer(data: {
        id: number
        x: number
        y: number
        moving?: { up: boolean; down: boolean; left: boolean; right: boolean }
    }) {
        let player = new Mob()
        this.addEntity('player', player, data.id)
        if (this.connection.selectedCharacter.id === data.id) {
            this.setSelf(player)
        }
        return player
    }

    private setSelf(player) {
        this.self = player
        this.cameras.main.startFollow(player.sprite.body, true, 0.05, 0.05)
    }
}
