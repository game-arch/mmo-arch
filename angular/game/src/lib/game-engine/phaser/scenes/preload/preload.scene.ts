import { Location }         from '@angular/common'
import { MultiplayerScene } from '../multiplayer.scene'
import Scene = Phaser.Scene

export class PreloadScene extends Scene {
    name = 'preload'


    preloaded = false

    constructor(private location: Location) {
        super({
            key: 'preload'
        })
    }

    preload() {
        if (!this.preloaded) {
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
            this.preloaded = true
        }
    }

    asset(url: string) {
        return this.location.prepareExternalUrl(url)
    }

    create() {
        let scene: MultiplayerScene = this.game.scene.getScene('tutorial') as MultiplayerScene
        scene.create()
        scene = this.game.scene.getScene('tutorial-2') as MultiplayerScene
        scene.create()
    }

    update(time: number, delta: number): void {
    }

    loadSpritesheets() {
        const sheetPath = './assets/spritesheets'
        this.load.setPath(sheetPath)
        this.load.atlas('Template', '/template.png', '/template.json')
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
