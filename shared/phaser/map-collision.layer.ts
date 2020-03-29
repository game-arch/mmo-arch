import { MapShape }    from '../interfaces/map-shape'
import { VectorArray } from '../interfaces/map-config'
import Group = Phaser.Physics.Arcade.Group

export class MapCollisionLayer {
    exits: { [id: string]: MapShape }        = {}
    entrances: { [id: string]: VectorArray } = {}
    collisions: { [id: string]: Group } = {}
    players?: Group
    npcs?: Group

    constructor(private data: Partial<MapCollisionLayer>) {
        this.exits      = data.exits || {}
        this.entrances  = data.entrances || {}
        this.collisions = data.collisions || {}
        this.players = data.players || null
        this.npcs = data.npcs || null
    }
}
