import { BaseScene } from '../../../../../../../../../server/services/map/maps/base.scene'

export class PreloadScene extends BaseScene {
    constructor() {
        super({
            name: 'preload',
        })
    }

    preload() {
        // add the loading bar to use as a display for the loading progress of the remainder of the assets
        const barBg = this.add.image(
            this.sys.canvas.width / 2,
            this.sys.canvas.height / 2,
            'barBg'
        )
        const bar = this.add.sprite(
            this.sys.canvas.width / 2,
            this.sys.canvas.height / 2,
            'bar'
        )

        const mask = this.make.graphics({
            x: bar.x - bar.width / 2,
            y: bar.y - bar.height / 2,
            add: false,
        })
        mask.fillRect(0, 0, 0, bar.height)

        bar.mask = new Phaser.Display.Masks.GeometryMask(this, mask)

        this.load.on('progress', (progress: number) => {
            mask.clear()
            mask.fillRect(0, 0, bar.width * progress, bar.height)
        })

        // load assets declared in the preload config
        this.loadSpritesheets()
    }

    create() {
        this.scene.start('title')
    }

    loadSpritesheets() {
        const sheetPath = './assets/spritesheets'
        const sheets = ['Cat', 'Dog', 'Boss']

        this.load.setPath(sheetPath)

        for (let i = 0; i < sheets.length; i++) {
            this.load.atlas(sheets[i], `${sheets[i]}.png`, `${sheets[i]}.json`)
        }

        this.load.atlas('Enemy', '/Enemy/Enemy.png', '/Enemy/Enemy.json')
        this.load.atlas('Female', '/Female/Female.png', '/Female/Female.json')
        this.load.atlas('Male', '/Male/Male.png', '/Male/Male.json')
        this.load.atlas(
            'Soldier',
            '/Soldier/Soldier.png',
            '/Soldier/Soldier.json'
        )
    }
}
