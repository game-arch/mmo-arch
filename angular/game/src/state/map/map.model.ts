import { Directions } from '../../../../../shared/phaser/directions'
import { Mob }        from '../../../../../shared/phaser/mob'

export class MapModel {
    directionalInput: Directions  = new Directions()
    player: { [id: number]: Mob } = {}
    npc: { [id: number]: Mob }    = {}
    scene: string                 = 'preload'
}
