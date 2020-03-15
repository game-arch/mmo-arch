import { BaseScene } from '../../../../../../../../nest/local/map/maps/base.scene'
import { Location }  from '@angular/common'
import Scene = Phaser.Scene

export class PreloadScene extends BaseScene implements Scene {
    preloaded = false

    constructor(private location: Location) {
        super({
            name: 'preload'
        })
    }

    preload() {
        this.load.on('progress', (progress: number) => {
            if (progress < 1) {
                this.game.events.emit('load.progress', progress)
            }
        })
        this.load.on('complete', () => {
            this.game.events.emit('load.progress', .999)
            setTimeout(() => {
                this.game.events.emit('load.progress', 1)
                this.game.events.emit('load.complete')
            }, 1000)
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
