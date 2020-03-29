import Image = Phaser.GameObjects.Image
import Scene = Phaser.Scene;

export class TitleScene extends Scene {
    background: Image
    name = 'title'

    constructor() {
        super({key: 'title'})
    }

    create() {
        this.background = this.add.image(0, 0, 'background')
        const width     = this.game.scale.width
        const height    = this.game.scale.height
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
