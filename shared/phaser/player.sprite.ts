import { MobSprite } from './mob-sprite'
import { isServer }  from '../constants/environment-constants'
import Scene = Phaser.Scene
import Group = Phaser.GameObjects.Group

export class PlayerSprite extends MobSprite {

    constructor(public name: string = '', scene: Scene, group: Group, public x: number, public y: number, key: string = !isServer ? 'Template' : '') {
        super(name, scene, group, x, y, key)
    }

    walkTick = 0

    preUpdate(...args) {
        super.preUpdate(...args)
        this.walkTick++
        if (isServer) {
            if (this.walking && this.walkTick % 20 === 0) {
                this.onVelocityChange()
                this.walkTick = 0
            }
        }
    }
}
