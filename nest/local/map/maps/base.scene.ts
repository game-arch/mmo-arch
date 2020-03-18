import {MapConfig}      from '../../../../shared/interfaces/map-config'
import {from, Subject}  from 'rxjs'
import {loadCollisions} from '../../../../shared/phaser/collisions'
import {Mob}            from '../../../../shared/phaser/mob'
import Scene = Phaser.Scene
import Group = Phaser.Physics.Arcade.Group
import {MapShape}       from "../../../../shared/interfaces/map-shape";

export class BaseScene extends Scene implements Scene {
    constant: string
    name: string
    emitter = new Subject()

    entities: {
        player: { [characterId: number]: Mob }
        mob: { [mobId: number]: Mob }
    } = {player: {}, mob: {}}
    collisionGroups: { overlaps: MapShape[]; colliders: MapShape[] }

    onTransition = (player: Mob, toMap: string, toId: string) => {
    }

    layers: {
        terrain: Phaser.Tilemaps.StaticTilemapLayer
        deco: Phaser.Tilemaps.StaticTilemapLayer
        buildings: Phaser.Tilemaps.StaticTilemapLayer
    }

    map: Phaser.Tilemaps.Tilemap

    constructor(public config: MapConfig) {
        super({
            key: config.constant
        });
        this.constant = config.constant;
        this.name     = config.name;
    }

    create() {
        this.physics.world.TILE_BIAS = 40
        this.collisionGroups         = loadCollisions(this.config, this)
        this.physics.add.group(this.collisionGroups.colliders, {
            visible      : true,
            frameQuantity: 30,
            immovable    : true,
        })
        this.physics.add.group(this.collisionGroups.overlaps, {
            visible      : true,
            frameQuantity: 30,
            immovable    : true,
        })
    }

    update(time: number, delta: number) {
        this.emitter.next()
    }

    init() {
        // TODO preload tilemap
        // this.map = this.make.tilemap({ key: this.config.name })
        // this.physics.world.setBounds(
        //     0,
        //     0,
        //     this.map.widthInPixels,
        //     this.map.heightInPixels
        // )
        // const tileset = this.map.addTilesetImage(
        //     this.config.tilesetName,
        //     this.config.tiles,
        //     16,
        //     16,
        //     0,
        //     0
        // )
        // this.layers = {
        //     terrain: this.map.createStaticLayer('terrain', tileset, 0, 0),
        //     deco: this.map.createStaticLayer('decoration', tileset, 0, 0),
        //     buildings: this.map.createStaticLayer('buildings', tileset, 0, 0),
        // }
        // this.layers.terrain.setCollisionByProperty({ collides: true })
        // this.layers.deco.setCollisionByProperty({ collides: true })
        // this.layers.buildings.setCollisionByProperty({ collides: true })
    }

    addEntity(type: 'player' | 'mob', mob: Mob, id: number) {
        this.entities[type]     = this.entities[type] || {}
        this.entities[type][id] = mob
        this.entities[type][id].create(this, mob.x, mob.y)
        this.physics.add.collider(mob.sprite, this.collisionGroups.colliders)
        if (type === 'player') {
            from(this.collisionGroups.overlaps)
                .subscribe(shape => {
                    if (shape.config.transitionTo) {
                        this.physics.add.overlap(mob.sprite, shape, () => {
                            this.onTransition(mob, shape.config.transitionTo.split('.')[0], shape.config.transitionTo)
                        })
                    }
                })
        }
    }

    removeEntity(type: 'player' | 'mob', id: number) {
        if (this.entities[type][id]) {
            this.entities[type][id].sprite.destroy()
            delete this.entities[type][id]
        }
    }

    getAllPlayers() {
        return Object.keys(this.entities.player).map(key =>
            this.entities.player[key].asPayload()
        )
    }
}
