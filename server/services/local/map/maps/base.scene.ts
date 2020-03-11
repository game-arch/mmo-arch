import { MapConfig }      from '../config/config'
import { Subject }        from 'rxjs'
import { loadCollisions } from '../../../../lib/phaser/collisions'
import { Mob }            from '../../../../lib/phaser/mob'
import Scene = Phaser.Scene
import Group = Phaser.Physics.Arcade.Group

export class BaseScene extends Scene implements Scene {
    constant: string
    name: string
    emitter = new Subject()

    entities: {
        player: { [characterId: number]: Mob }
        mob: { [mobId: number]: Mob }
    } = { player: {}, mob: {} }
    collisionGroups: { overlaps: Group; colliders: Group }

    layers: {
        terrain: Phaser.Tilemaps.StaticTilemapLayer
        deco: Phaser.Tilemaps.StaticTilemapLayer
        buildings: Phaser.Tilemaps.StaticTilemapLayer
    }

    map: Phaser.Tilemaps.Tilemap

    constructor(public config: MapConfig) {
        super({
            key: config.name
        })
    }

    create() {
        this.physics.world.TILE_BIAS = 40
        this.collisionGroups         = loadCollisions(this.config, this)
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
        this.physics.add.overlap(mob.sprite, this.collisionGroups.overlaps)
    }

    removeEntity(type: 'player' | 'mob', id: number) {
        if (this.entities[type][id]) {
            this.entities[type][id].sprite.stopListening.next()
            this.entities[type][id].destroy()
            delete this.entities[type][id]
        }
    }

    getAllPlayers() {
        return Object.keys(this.entities.player).map(key =>
            this.entities.player[key].asPayload()
        )
    }
}
