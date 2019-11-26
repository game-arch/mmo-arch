import {EventEmitter, Injectable, Injector} from '@angular/core';
import {ConnectionManager}                  from "../../../connection/src/lib/connection-manager";
import {Game}                               from "phaser";
import {GAME_CONFIG}                        from "./phaser/config";
import {SceneFactory}                       from "./phaser/scenes/scene-factory.service";
import {fromEvent}                          from "rxjs";
import {mergeMap, takeUntil}                from "rxjs/operators";
import {PlayerEnteredMap, PlayerLeftMap}    from "../../../../../game-servers/src/world/map/actions";

@Injectable()
export class GameEngineService {

    game: Game;

    private currentScene = 'title';

    private destroyed = new EventEmitter();


    constructor(
        public scenes: SceneFactory,
        public connection: ConnectionManager
    ) {
    }

    init(canvas: HTMLCanvasElement) {
        this.game = new Game({...GAME_CONFIG, canvas});
        this.game.scene.add('title', this.scenes.title());
        this.game.scene.add('tutorial', this.scenes.tutorial());
        this.game.scene.start('title');
        fromEvent(window, 'resize')
            .pipe(takeUntil(this.destroyed))
            .subscribe(() => this.game.events.emit('resize', window.innerWidth, window.innerHeight));
        this.game.events.on('game.scene', (scene) => {
            if (this.currentScene !== '') {
                this.game.scene.stop(this.currentScene);
            }
            this.currentScene = scene;
            this.game.scene.start(scene);
        });

        this.connection.world$
            .pipe(takeUntil(this.destroyed))
            .subscribe(world => {
                if (world.socket) {
                    fromEvent(world.socket, PlayerEnteredMap.event)
                        .pipe(takeUntil(this.destroyed))
                        .subscribe((data) => {
                            console.log('Player Joined', data);
                        });

                    fromEvent(world.socket, PlayerLeftMap.event)
                        .pipe(takeUntil(this.destroyed))
                        .subscribe((data) => {
                            console.log('Player Left', data);
                        });
                }
            });
    }

    destroy() {
        this.game.events.emit('destroy');
        this.game.destroy(true);
        this.destroyed.emit();
    }
}
