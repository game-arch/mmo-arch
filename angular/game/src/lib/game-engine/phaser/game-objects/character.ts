import { BaseScene } from '../../../../../../../shared/phaser/base.scene'

type CharacterAnimation = {
    [K in Orientation]: {
        flip: boolean
        anim: string
    }
}

export enum Orientation {
    Left = 'left',
    Right = 'right',
    Up = 'up',
    Down = 'down',
}

export abstract class Character extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: BaseScene, x: number, y: number, sprite: string) {
        super(scene, x, y, sprite, 0)
        this.scene = scene
        this.scene.physics.add.existing(this)
        this.scene.add.existing(this)
    }

    protected animate(
        animationKeys: CharacterAnimation,
        orientation: Orientation
    ) {
        const { flip, anim } = animationKeys[orientation]
        this.setFlipX(flip)
        this.play(anim, true)
    }
}
