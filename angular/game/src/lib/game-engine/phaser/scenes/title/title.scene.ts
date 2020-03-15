import Image = Phaser.GameObjects.Image
import { BaseScene } from '../../../../../../../../nest/local/map/maps/base.scene'

export class TitleScene extends BaseScene {
    background: Image

    constructor() {
        super({ name: 'title' })
    }

    create() {
        this.background = this.add.image(0, 0, 'background')
        let width       = this.game.scale.width
        let height      = this.game.scale.height
        this.background.setDisplaySize(width, height)
        this.background.setPosition(width / 2, height / 2)
        this.game.events.on('resize', (width, height) =>
            this.resize(width, height)
        )
    }

    resize(width, height) {
        this.background.setDisplaySize(width, height)
        this.background.setPosition(width / 2, height / 2)
    }

    update(time: number, delta: number): void {
    }
}
