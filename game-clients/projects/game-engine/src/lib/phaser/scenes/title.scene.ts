import Scene = Phaser.Scene;
import {Inject, Injectable} from "@angular/core";
import {Location}           from "@angular/common";
import Image = Phaser.GameObjects.Image;

@Injectable()
export class TitleScene extends Scene {
    background: Image;

    constructor(@Inject(Location) private location: Location) {
        super({
            key: 'title'
        });
    }


    init() {

    }

    preload() {
        this.load.image('background', this.location.prepareExternalUrl('/assets/backgrounds/login.png'));
    }

    create() {
        this.background = this.add.image(0, 0, 'background');
    }

    update(time: number, delta: number): void {
        console.log(this.background);
        this.background.width  = this.game.scale.width;
        this.background.height = this.game.scale.height;
    }
}
