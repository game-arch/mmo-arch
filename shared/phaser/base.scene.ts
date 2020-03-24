import { MapConfig }             from '../interfaces/map-config'
import { loadCollisions }        from './collisions'
import { Mob }                   from './mob'
import { Directions }            from './directions'
import { MapCollisionLayer }     from './map-collision.layer'
import { filter, map, mergeMap } from 'rxjs/operators'
import { from }                  from 'rxjs'
import { MobSprite }             from './mob-sprite'
import Scene = Phaser.Scene

export class BaseScene extends Scene implements Scene {
    constant: string
    name: string

    players: { [characterId: number]: Mob }             = {}
    mobs: { [mobId: number]: Mob }                      = {}
    mobSprites: { [mobId: number]: MobSprite }          = {}
    playerSprites: { [characterId: number]: MobSprite } = {}
    layers: { [id: string]: MapCollisionLayer }         = {}

    savePlayer   = (player: MobSprite) => {
    }
    emitMob      = (mob: MobSprite) => {
    }
    onTransition = (mob: MobSprite, toMap: string, toId: string) => {
    }

    constructor(public config: MapConfig) {
        super({
            key: config.constant
        })
        this.constant = config.constant
        this.name     = config.name
    }

    async create() {
        this.physics.world.TILE_BIAS = 40
        if (this.config) {
            this.layers = await loadCollisions(this.config, this)
            from(Object.keys(this.config.layers))
                .pipe(filter(layer => !!this.config.layers[layer].exits))
                .pipe(mergeMap(layer => from(Object.keys(this.config.layers[layer].exits)).pipe(map(key => ({
                    shape     : this.layers[layer].exits[key],
                    transition: this.config.layers[layer].exits[key]
                })))))
                .subscribe(({ shape, transition }) => {
                    let overlapped = false
                    this.physics.add.overlap(this.layers.mobs.players, shape, (obj1, obj2) => {
                        if (!overlapped) {
                            this.onTransition(obj2 as MobSprite, transition.landingMap, transition.landingId)
                            overlapped = true
                            setTimeout(() => {
                                overlapped = false
                            }, 1000)
                        }
                    })
                })
        }
    }

    addPlayer(player: Mob) {
        this.players[player.id]          = player
        this.playerSprites[player.id]    = new MobSprite(player.name, this, player.x, player.y, '')
        this.playerSprites[player.id].id = player.id
        this.layers.mobs.players.add(this.playerSprites[player.id])
    }

    addMob(mob: Mob) {
        this.mobs[mob.id]          = mob
        this.mobSprites[mob.id]    = new MobSprite(mob.name, this, mob.x, mob.y, '')
        this.mobSprites[mob.id].id = mob.id
        this.layers.mobs.npcs.add(this.mobSprites[mob.id])
    }

    addEntity(type: 'player' | 'mob', mob: Mob) {
        if (type === 'player') {
            this.addPlayer(mob)
            this.playerSprites[mob.id].onVelocityChange = () => this.emitMob(this.playerSprites[mob.id])
            this.playerSprites[mob.id].onStopMoving     = () => this.savePlayer(this.playerSprites[mob.id])
        } else {
            this.addMob(mob)
            this.mobSprites[mob.id].onVelocityChange = () => this.emitMob(this.mobSprites[mob.id])
        }
    }

    removeEntity(type: 'player' | 'mob', id: number) {
        if (type === 'player') {
            this.layers.mobs.players.remove(this.playerSprites[id])
            this.playerSprites[id].destroy()
            delete this.players[id]
            delete this.playerSprites[id]
        } else {
            this.layers.mobs.npcs.remove(this.mobSprites[id])
            this.mobSprites[id].destroy()
            delete this.mobs[id]
            delete this.mobSprites[id]
        }
    }

    moveEntity(type: 'player' | 'mob', id: number, directions: Directions) {
        if (type === 'player') {
            this.playerSprites[id].moving = {
                up   : !!directions.up,
                down : !!directions.down,
                left : !!directions.left,
                right: !!directions.right
            }
            return
        }
        this.mobSprites[id].moving = {
            up   : !!directions.up,
            down : !!directions.down,
            left : !!directions.left,
            right: !!directions.right
        }
    }

    getAllPlayers() {
        return Object.keys(this.playerSprites).map(key =>
            this.playerSprites[key].asPayload()
        )
    }
}
