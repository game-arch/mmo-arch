import { BaseScene }                             from '../../../../../../../shared/phaser/base.scene'
import { Mob }                                   from '../../../../../../../shared/phaser/mob'
import { MapConfig }                             from '../../../../../../../shared/interfaces/map-config'
import { PlayerDirectionalInput, PlayerLeftMap } from '../../../../../../../nest/local/map/actions'
import { ConnectionManager }                     from '../../../connection/connection-manager'
import Scene = Phaser.Scene

export class MultiplayerScene extends BaseScene implements Scene {
    self: Mob
    directionMap = {
        s: 'down',
        w: 'up',
        a: 'left',
        d: 'right'
    }
    directions   = {
        up   : false,
        down : false,
        right: false,
        left : false
    }


    constructor(protected manager: ConnectionManager, config: MapConfig) {
        super(config)
    }


    get connection() {
        return this.manager.world
    }

    toggleDirection(event: KeyboardEvent, status: boolean) {
        if (this.directionMap.hasOwnProperty(event.key)) {
            event.stopImmediatePropagation()
            const direction = this.directionMap[event.key]
            if (this.directions[direction] !== status) {
                this.directions[direction] = status
                this.sendDirectionalInput()
            }
        }
    }

    sendDirectionalInput() {
        this.connection.socket.emit(PlayerDirectionalInput.event, {
            directions: this.directions
        })
    }

    removePlayer(data: PlayerLeftMap) {
        this.removeEntity('player', data.characterId)
    }

    addOrUpdatePlayer(data: Mob) {
        let player       = this.players[data.id] || this.createPlayer(data)
        let playerSprite = this.playerSprites[player.id]
        playerSprite.setPosition(data.x, data.y)
        if (data.moving) {
            playerSprite.moving = data.moving
        }
    }

    createPlayer(player: Mob) {
        let mob = new Mob(player.name)
        mob.id  = player.id
        mob.x   = player.x
        mob.y   = player.y
        this.addEntity('player', mob)
        this.playerSprites[player.id].moving = player.moving || this.playerSprites[player.id].moving
        if (this.connection.selectedCharacter.id === player.id) {
            this.setSelf(mob)
        }
        return mob
    }

    setSelf(player: Mob) {
        this.self = player
        this.cameras.main.startFollow(this.playerSprites[player.id].body, true, 0.05, 0.05)
    }

    destroy() {
        this.directions    = {
            up   : false,
            down : false,
            right: false,
            left : false
        }
        this.self          = null
        this.players       = {}
        this.mobs          = {}
        this.playerSprites = {}
        this.mobSprites    = {}
    }
}
