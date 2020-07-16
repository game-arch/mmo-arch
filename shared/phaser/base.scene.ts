import { MapConfig }         from '../interfaces/map-config'
import { loadCollisions }    from './collisions'
import { Mob }               from './mob'
import { Directions }        from './directions'
import { MapCollisionLayer } from './map-collision.layer'
import { MobSprite }         from './mob-sprite'
import { interval, Subject } from 'rxjs'
import { takeUntil }         from 'rxjs/operators'
import { NpcConfig }         from '../interfaces/npc-config'
import { NpcSprite }         from './npc.sprite'
import { isServer }          from '../constants/environment-constants'
import { PlayerSprite }      from './player.sprite'
import Scene = Phaser.Scene
import Group = Phaser.Physics.Arcade.Group

export class BaseScene extends Scene implements Scene {
    onCreate = new Subject()
    constant: string
    name: string

    players: { [characterId: number]: Mob }             = {}
    npcs: { [mobId: number]: Mob }                      = {}
    npcSprites: { [mobId: number]: MobSprite }          = {}
    playerSprites: { [characterId: number]: MobSprite } = {}
    layers: { [id: string]: MapCollisionLayer }         = {}

    allMobSprites: Group

    protected stop$ = new Subject()

    savePlayer = (player: MobSprite) => {
    }
    emitPlayer = (player: MobSprite) => {
    }
    emitMob    = (mob: MobSprite) => {

    }

    canTransition: {
        [id: number]: {
            mob: MobSprite,
            landingMap: string,
            landingId: string
        }
    } = {}

    constructor(public config: MapConfig) {
        super({
            key: config.constant
        })
        this.constant = config.constant
        this.name     = config.name
    }

    create() {
        this.stop$.next()
        this.canTransition           = {}
        this.physics.world.TILE_BIAS = 40
        this.layers                  = {
            mobs: new MapCollisionLayer({
                players: this.physics.add.group([], {
                    visible       : true,
                    runChildUpdate: true
                }),
                npcs   : this.physics.add.group([], {
                    visible       : true,
                    runChildUpdate: true
                })
            })
        }
        this.allMobSprites           = this.physics.add.group([], {
            visible       : true,
            runChildUpdate: true
        })
        if (this.config) {
            this.layers = loadCollisions(this.layers, this.config, this)
            for (let layer of Object.keys(this.config.layers)) {
                if (!!this.config.layers[layer].exits) {
                    for (let key of Object.keys(this.config.layers[layer].exits)) {
                        let shape      = this.layers[layer].exits[key]
                        let transition = this.config.layers[layer].exits[key]
                        this.physics.add.overlap(this.layers.mobs.players, shape, (obj1, obj2: MobSprite) => {
                            if (!this.canTransition[obj2.id]) {
                                let stop                    = new Subject()
                                this.canTransition[obj2.id] = this.canTransition[obj2.id] || {
                                    mob       : obj2,
                                    landingMap: transition.landingMap,
                                    landingId : transition.landingId
                                }
                                interval(300)
                                    .pipe(takeUntil(stop))
                                    .pipe(takeUntil(this.stop$))
                                    .subscribe(() => {
                                        if (!this.physics.world.overlap(obj1, obj2)) {
                                            delete this.canTransition[obj2.id]
                                            stop.next()
                                        }
                                    })
                            }
                        })
                    }
                }
            }
        }
        this.onCreate.next()
    }

    playerCount = 0

    update(time: number, delta: number): void {
        super.update(time, delta)
        if (!isServer) {
        }
        if (isServer) {
            if (this.playerCount === 0) {
                this.game.scene.pause(this.config.constant)
            }
        }
    }

    addPlayer(player: Mob) {
        if (!this.players[player.instanceId]) {
            this.playerCount++
            if (isServer) {
                if (!this.game.scene.isActive(this.config.constant)) {
                    this.game.scene.resume(this.config.constant)
                }
            }
        }
        this.players[player.instanceId]                        = player
        this.playerSprites[player.instanceId]                  = new PlayerSprite(player.instanceId, this, this.layers.mobs.players, player.x, player.y)
        this.playerSprites[player.instanceId].id               = player.instanceId
        this.playerSprites[player.instanceId].name             = player.name
        this.playerSprites[player.instanceId].onVelocityChange = () => this.emitPlayer(this.playerSprites[player.instanceId])
        this.playerSprites[player.instanceId].onStopMoving     = () => this.savePlayer(this.playerSprites[player.instanceId])
        this.allMobSprites.add(this.playerSprites[player.instanceId])
    }

    addNpc(mob: Mob, npcConfig?: NpcConfig) {
        npcConfig                                        = npcConfig || <NpcConfig>{
            ...mob,
            key     : 'Template',
            position: [mob.x, mob.y]
        }
        this.npcs[mob.instanceId]                        = mob
        this.npcSprites[mob.instanceId]                  = new NpcSprite(this, this.layers.mobs.npcs, npcConfig)
        this.npcSprites[mob.instanceId].npcConfig        = npcConfig
        this.npcSprites[mob.instanceId].id               = mob.instanceId
        this.npcSprites[mob.instanceId].name             = mob.name
        this.npcSprites[mob.instanceId].onVelocityChange = () => this.emitMob(this.npcSprites[mob.instanceId])
        this.allMobSprites.add(this.npcSprites[mob.instanceId])
    }

    removePlayer(id: number) {
        if (this.players[id]) {
            this.playerCount--
            if (this.playerCount < 0) {
                this.playerCount = 0
            }
        }
        if (this.containsPlayer(id)) {
            this.layers.mobs.players.remove(this.playerSprites[id])
            this.allMobSprites.remove(this.playerSprites[id], true, true)
        }
        delete this.players[id]
        delete this.playerSprites[id]
    }

    containsPlayer(id: number) {
        return this.layers.mobs.players.children && this.layers.mobs.players.contains(this.playerSprites[id])
    }

    removeNpc(id: number) {
        if (this.layers.mobs.npcs.children && this.layers.mobs.npcs.contains(this.npcSprites[id])) {
            this.layers.mobs.npcs.remove(this.npcSprites[id])
            this.allMobSprites.remove(this.npcSprites[id], true, true)
        }
        delete this.npcs[id]
        delete this.npcSprites[id]
    }

    moveEntity(type: 'player' | 'mob', id: number, directions: Directions) {
        if (type === 'player') {
            if (this.playerSprites[id]) {
                this.playerSprites[id].directions = {
                    up   : !!directions.up,
                    down : !!directions.down,
                    left : !!directions.left,
                    right: !!directions.right
                }
            }
            return
        }
        if (this.npcSprites[id]) {
            this.npcSprites[id].directions = {
                up   : !!directions.up,
                down : !!directions.down,
                left : !!directions.left,
                right: !!directions.right
            }
        }
    }

    getAllPlayers() {
        return Object.keys(this.playerSprites).map(key =>
            this.playerSprites[key].asPayload(this.name)
        )
    }

    getAllNpcs() {
        return Object.keys(this.npcSprites).map(key =>
            this.npcSprites[key].asPayload(this.name)
        )
    }
}
