import {Injectable}        from '@angular/core';
import {ConnectionManager} from "../../../connection/src/lib/connection-manager";
import {Game}              from "phaser";
import {GAME_CONFIG}       from "./phaser/config";
import {TitleScene}        from "./phaser/scenes/title.scene";

@Injectable()
export class GameEngineService {

    game: Game;

    constructor(
        public connection: ConnectionManager,
        private title: TitleScene
    ) {
    }

    init(canvas: HTMLCanvasElement) {
        this.game = new Game({...GAME_CONFIG, canvas});
        this.game.scene.add('title', this.title);
        this.game.scene.start('title');
    }
}
