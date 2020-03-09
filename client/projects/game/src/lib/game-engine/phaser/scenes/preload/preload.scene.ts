import { BaseScene } from '../../../../../../../../../server/services/map/maps/base.scene'
import { Location } from '@angular/common'

export class PreloadScene extends BaseScene {
    constructor(private location: Location) {
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

        this.load.image(
            'background',
            this.asset('/assets/backgrounds/login.png')
        )
        this.loadSpritesheets()
    }

    asset(url: string) {
        return this.location.prepareExternalUrl(url)
    }

    create() {
        this.scene.start('title')
    }

    loadSpritesheets() {
        const sheetPath = './assets/spritesheets'
        this.load.setPath(sheetPath)

        this.load.atlas('Boss', '/Boss/Boss1.png', '/Boss/Boss1.json')
        this.load.atlas('Animal', '/Animal/Animal.png', '/Animal/Animal.json')
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
