import { MapConfig }             from '../interfaces/map-config'
import { loadCollisions }        from './collisions'
import { Mob }                   from './mob'
import { Directions }            from './directions'
import { MapCollisionLayer }     from './map-collision.layer'
import { filter, map, mergeMap } from 'rxjs/operators'
import { from }                  from 'rxjs'
import Scene = Phaser.Scene

export class BaseScene extends Scene implements Scene {
    constant: string
    name: string

    entities: {
        player: { [characterId: number]: Mob }
        mob: { [mobId: number]: Mob }
    } = { player: {}, mob: {} }

    layers: { [id: string]: MapCollisionLayer } = {}

    savePlayer   = (player: Mob) => {
    }
    emitMob      = (mob: Mob) => {
    }
    onTransition = (mob: Mob, toMap: string, toId: string) => {
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
        }
    }

    addEntity(type: 'player' | 'mob', mob: Mob) {
        let id                  = mob.id
        this.entities[type]     = this.entities[type] || {}
        this.entities[type][id] = mob
        this.entities[type][id].create(this, mob.x, mob.y)
        this.layers.mobs[type === 'player' ? 'players' : 'npcs'].add(mob.sprite)
        mob.sprite.onVelocityChange = () => this.emitMob(mob)
        if (type === 'player') {
            mob.sprite.onStopMoving = () => this.savePlayer(mob)
            from(Object.keys(this.config.layers))
                .pipe(filter(layer => !!this.config.layers[layer].exits))
                .pipe(mergeMap(layer => from(Object.keys(this.config.layers[layer].exits)).pipe(map(key => ({
                    shape     : this.layers[layer].exits[key],
                    transition: this.config.layers[layer].exits[key]
                })))))
                .subscribe(({ shape, transition }) => {
                    let overlapped = false
                    this.physics.add.overlap(mob.sprite, shape, () => {
                        if (!overlapped) {
                            this.onTransition(mob, transition.landingMap, transition.landingId)
                            overlapped = true
                            setTimeout(() => {
                                overlapped = false
                            }, 1000)
                        }
                    })
                })
        }
    }

    removeEntity(type: 'player' | 'mob', id: number) {
        if (this.entities[type][id]) {
            this.layers.mobs[type === 'player' ? 'players' : 'npcs'].remove(this.entities[type][id].sprite)
            this.entities[type][id].sprite.destroy()
            delete this.entities[type][id]
        }
    }

    moveEntity(type: 'player' | 'mob', id: number, directions: Directions) {
        const mob = this.entities[type][id]
        if (mob) {
            mob.sprite.moving = {
                up   : !!directions.up,
                down : !!directions.down,
                left : !!directions.left,
                right: !!directions.right
            }
        }
    }

    getAllPlayers() {
        return Object.keys(this.entities.player).map(key =>
            this.entities.player[key].asPayload()
        )
    }
}
