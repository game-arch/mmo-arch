import { Directions } from '../../../../../shared/phaser/directions'
import { Mob }        from '../../../../../shared/phaser/mob'

export class SceneModel {
    directionalInput: Directions  = new Directions()
    player: { [id: number]: Mob } = {}
    npc: { [id: number]: Mob }    = {}
    scene: string                 = 'preload'
}
