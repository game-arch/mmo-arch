import {EventEmitter, Injectable, Injector} from '@angular/core';
import {ConnectionManager}                  from "../../../connection/src/lib/connection-manager";
import {Game}                               from "phaser";
import {GAME_CONFIG}                        from "./phaser/config";
import {TitleScene}                         from "./phaser/scenes/title.scene";
import {SceneFactory}                       from "./phaser/scenes/scene-factory.service";
import {fromEvent}                          from "rxjs";
import {takeUntil}                          from "rxjs/operators";

@Injectable()
export class GameEngineService {

    game: Game;
    title: TitleScene;

    private destroyed = new EventEmitter();

    constructor(
        public scenes: SceneFactory,
        public connection: ConnectionManager
    ) {
    }

    init(canvas: HTMLCanvasElement) {
        this.title = this.scenes.title();
        this.game  = new Game({...GAME_CONFIG, canvas});
        this.game.scene.add('title', this.title);
        this.game.scene.start('title');
        fromEvent(window, 'resize')
            .pipe(takeUntil(this.destroyed))
            .subscribe(() => this.game.events.emit('resize', window.innerWidth, window.innerHeight));
    }

    destroy() {
        this.game.destroy(true);
        this.destroyed.emit();
    }
}
