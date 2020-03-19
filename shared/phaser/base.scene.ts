import {MapConfig}      from '../interfaces/map-config'
import {from}           from 'rxjs'
import {loadCollisions} from './collisions'
import {Mob}            from './mob'
import Scene = Phaser.Scene
import {MapShape}       from "../interfaces/map-shape";
import Group = Phaser.GameObjects.Group;
import {Directions}     from "./directions";

export class BaseScene extends Scene implements Scene {
    constant: string
    name: string

    entities: {
        player: { [characterId: number]: Mob }
        mob: { [mobId: number]: Mob }
    } = {player: {}, mob: {}}
    collisionGroups: {
        players: Group,
        overlaps: MapShape[];
        colliders: MapShape[]
    }

    savePlayer   = (player: Mob) => {
    }
    emitMob      = (mob: Mob) => {
    }
    onTransition = (mob: Mob, toMap: string, toId: string) => {
    }

    constructor(public config: MapConfig) {
        super({
            key: config.constant
        });
        this.constant = config.constant;
        this.name     = config.name;
    }

    create() {
        this.physics.world.TILE_BIAS = 40
        if (this.config) {
            this.collisionGroups = {
                ...loadCollisions(this.config, this),
                players: this.physics.add.group([], {
                    visible      : true,
                    frameQuantity: 30
                })
            };

            this.physics.add.collider(this.collisionGroups.players, this.collisionGroups.colliders)
            this.physics.add.group(this.collisionGroups.colliders, {
                visible  : true,
                immovable: true,
            })
            this.physics.add.group(this.collisionGroups.overlaps, {
                visible  : true,
                immovable: true,
            })
        }
    }

    addEntity(type: 'player' | 'mob', mob: Mob) {
        let id                  = mob.id
        this.entities[type]     = this.entities[type] || {}
        this.entities[type][id] = mob
        this.entities[type][id].create(this, mob.x, mob.y)
        this.collisionGroups.players.add(mob.sprite)
        mob.sprite.onVelocityChange = () => this.emitMob(mob)
        if (type === 'player') {
            mob.sprite.onStopMoving = () => this.savePlayer(mob)
            from(this.collisionGroups.overlaps)
                .subscribe(shape => {
                    if (shape.transition) {
                        let overlapped = false
                        this.physics.add.overlap(mob.sprite, shape, () => {
                            if (!overlapped) {
                                this.onTransition(mob, shape.transition.landingMap, shape.transition.landingId)
                                overlapped = true
                                setTimeout(() => {
                                    overlapped = false
                                }, 1000)
                            }
                        })
                    }
                })
        }
    }

    removeEntity(type: 'player' | 'mob', id: number) {
        if (this.entities[type][id]) {
            this.collisionGroups.players.remove(this.entities[type][id].sprite)
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
