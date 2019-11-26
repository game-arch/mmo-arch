import Scene = Phaser.Scene;
import {Location} from "@angular/common";
import Image = Phaser.GameObjects.Image;

export class TitleScene extends Scene {
    background: Image;

    constructor(private location: Location) {
        super({
            key: 'title'
        });
    }


    init() {

    }

    preload() {
        this.load.image('background', this.asset('/assets/backgrounds/login.png'));
    }

    asset(url: string) {
        return this.location.prepareExternalUrl(url);
    }

    create() {
        this.background = this.add.image(0, 0, 'background');
        let width       = this.game.scale.width;
        let height      = this.game.scale.height;
        this.background.setDisplaySize(width, height);
        this.background.setPosition(width / 2, height / 2);
        this.game.events.on('resize', (width, height) => this.resize(width, height));
    }

    resize(width, height) {
        this.background.setDisplaySize(width, height);
        this.background.setPosition(width / 2, height / 2);
    }

    update(time: number, delta: number): void {
    }
}
