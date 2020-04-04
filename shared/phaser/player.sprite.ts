import { MobSprite } from './mob-sprite'
import { isServer }  from '../constants/environment-constants'
import Scene = Phaser.Scene
import Group = Phaser.GameObjects.Group

export class PlayerSprite extends MobSprite {

    constructor(public id: number, scene: Scene, group: Group, public x: number, public y: number, key: string = !isServer ? 'Template' : '') {
        super(id, scene, group, x, y, key)
    }
}
