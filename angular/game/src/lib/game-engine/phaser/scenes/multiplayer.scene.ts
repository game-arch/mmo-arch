import { BaseScene }                                         from '../../../../../../../shared/phaser/base.scene'
import { Mob }                                               from '../../../../../../../shared/phaser/mob'
import { MapConfig }                                         from '../../../../../../../shared/interfaces/map-config'
import { PlayerAttemptedTransition, PlayerDirectionalInput } from '../../../../../../../nest/local/map/actions'
import { ConnectionManager }                                 from '../../../connection/connection-manager'
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

    transitionToNewMap() {
        if (this.canTransition[this.self.instanceId]) {
            this.connection.socket.emit(PlayerAttemptedTransition.event, {})
        }
    }


    addOrUpdatePlayer(data: Mob) {
        let player       = this.players[data.instanceId] || this.createPlayer(data)
        let playerSprite = this.playerSprites[player.instanceId]
        playerSprite.setPosition(data.x, data.y)
        if (data.moving) {
            playerSprite.moving = data.moving
        }
    }

    addOrUpdateNpc(data: Mob) {
        let npc       = this.npcs[data.instanceId] || this.createNpc(data)
        let npcSprite = this.npcSprites[npc.instanceId]
        npcSprite.setPosition(data.x, data.y)
        if (data.moving) {
            npcSprite.moving = data.moving
        }
    }

    createNpc(npc: Mob) {
        let mob        = new Mob(npc.name)
        mob.instanceId = npc.instanceId
        mob.x          = npc.x
        mob.y          = npc.y
        this.addNpc(mob)
        this.npcSprites[npc.instanceId].moving = npc.moving || this.playerSprites[npc.instanceId].moving
        return mob
    }

    createPlayer(player: Mob) {
        let mob        = new Mob(player.name)
        mob.instanceId = player.instanceId
        mob.x          = player.x
        mob.y          = player.y
        this.addPlayer(mob)
        this.playerSprites[player.instanceId].moving = player.moving || this.playerSprites[player.instanceId].moving
        if (this.connection.selectedCharacter.id === player.instanceId) {
            this.setSelf(mob)
        }
        return mob
    }

    setSelf(player: Mob) {
        this.self = player
        this.cameras.main.startFollow(this.playerSprites[player.instanceId].body, true, 0.05, 0.05)
    }

    destroy() {
        this.stop.next()
        this.directions    = {
            up   : false,
            down : false,
            right: false,
            left : false
        }
        this.self          = null
        this.players       = {}
        this.npcs          = {}
        this.playerSprites = {}
        this.npcSprites    = {}
    }
}
