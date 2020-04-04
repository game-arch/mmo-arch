import { BaseScene }                                         from '../../../../../../../shared/phaser/base.scene'
import { Mob }                                               from '../../../../../../../shared/phaser/mob'
import { MapConfig }                                         from '../../../../../../../shared/interfaces/map-config'
import { PlayerAttemptedTransition, PlayerDirectionalInput } from '../../../../../../../shared/events/map.events'
import { ConnectionManager }                                 from '../../../connection/connection-manager'
import { MobSprite }                                         from '../../../../../../../shared/phaser/mob-sprite'
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
            this.connection.socket.emit(PlayerAttemptedTransition.event, null, (result) => {
                if (!result.status) {
                    this.game.events.emit('transition_failed', result)
                }
            })
            return true
        }
        return false
    }


    addOrUpdatePlayer(data: Mob, replace: boolean = false) {
        let player                     = replace ? this.createPlayer(data) : (this.players[data.instanceId] || this.createPlayer(data))
        let playerSprite               = this.playerSprites[player.instanceId]
        playerSprite.shouldInterpolate = true
        this.moveMobTo(playerSprite, data.x, data.y, data.velX, data.velY)
        return playerSprite
    }

    moveMobTo(mob: MobSprite, x: number, y: number, velX: number, velY: number) {
        mob.setPosition(x, y)
        mob.body.setVelocity(velX, velY)
    }

    addOrUpdateNpc(data: Mob, replace: boolean = false) {
        let npc                     = replace ? this.createNpc(data) : (this.npcs[data.instanceId] || this.createNpc(data))
        let npcSprite               = this.npcSprites[npc.instanceId]
        npcSprite.shouldInterpolate = true
        this.moveMobTo(npcSprite, data.x, data.y, data.velX, data.velY)
        return npcSprite
    }

    createNpc(npc: Mob) {
        let mob        = new Mob(npc.name)
        mob.instanceId = npc.instanceId
        mob.x          = npc.x
        mob.y          = npc.y
        this.addNpc(mob)
        this.npcSprites[npc.instanceId].body.setVelocity(npc.velX, npc.velY)
        return mob
    }

    createPlayer(player: Mob) {
        let mob        = new Mob(player.name)
        mob.instanceId = player.instanceId
        mob.x          = player.x
        mob.y          = player.y
        this.addPlayer(mob)
        this.playerSprites[player.instanceId].body.setVelocity(player.velX, player.velY)
        if (this.connection.selectedCharacter.id === player.instanceId) {
            this.setSelf(mob)
        }
        return mob
    }

    setSelf(player: Mob) {
        this.self = player
        this.cameras.main.startFollow(this.playerSprites[player.instanceId].body, true, 0.05, 0.05)
    }

    reloadNpcs(npcs: Mob[]) {
        let ids = npcs.map(npc => npc.instanceId)
        for (let npc of npcs) {
            this.addOrUpdateNpc(npc)
        }
        for (let id of Object.keys(this.npcs)) {
            if (!ids.includes(Number(id))) {
                this.removeNpc(Number(id))
            }
        }
    }

    reloadPlayers(players: Mob[]) {
        let ids = players.map(player => player.instanceId)
        for (let player of players) {
            this.addOrUpdatePlayer(player)
        }
        for (let id of Object.keys(this.players)) {
            if (!ids.includes(Number(id))) {
                this.removePlayer(Number(id))
            }
        }
    }

    destroy() {
        this.stop$.next()
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
