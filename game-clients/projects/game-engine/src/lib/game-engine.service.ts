import {EventEmitter, Injectable, Injector}          from '@angular/core';
import {ConnectionManager}                           from "../../../connection/src/lib/connection-manager";
import {Game}                                        from "phaser";
import {GAME_CONFIG}                                 from "./phaser/config";
import {SceneFactory}                                from "./phaser/scenes/scene-factory.service";
import {from, fromEvent}                             from "rxjs";
import {mergeMap, takeUntil}                         from "rxjs/operators";
import {AllPlayers, PlayerEnteredMap, PlayerLeftMap} from "../../../../../game-servers/src/world/map/actions";
import {CharacterOffline, CharacterOnline}           from "../../../../../game-servers/src/global/character/actions";
import Scene = Phaser.Scene;
import {Player}                                      from "./phaser/entities/player";

@Injectable()
export class GameEngineService {

    game: Game;

    private currentSceneKey = 'title';
    private currentScene: Scene;
    private destroyed       = new EventEmitter();

    players: { [charaacterId: number]: Player } = {};

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
            if (this.currentSceneKey !== '') {
                this.game.scene.stop(this.currentSceneKey);
            }
            this.currentSceneKey = scene;
            this.currentScene    = this.game.scene.getScene(scene);
            this.game.scene.start(scene);
        });

        this.connection.world$
            .pipe(takeUntil(this.destroyed))
            .subscribe(world => {
                if (world.socket) {
                    fromEvent(world.socket, PlayerEnteredMap.event)
                        .pipe(takeUntil(this.destroyed))
                        .subscribe((data: PlayerEnteredMap) => {
                            console.log('Player Joined', data);
                        });
                    fromEvent(world.socket, PlayerLeftMap.event)
                        .pipe(takeUntil(this.destroyed))
                        .subscribe((data: PlayerLeftMap) => {
                            console.log('Player Left', data);
                            this.removePlayer(data);
                        });
                    fromEvent(world.socket, AllPlayers.event)
                        .pipe(takeUntil(this.destroyed))
                        .pipe(mergeMap((players: { characterId: number, x: number, y: number }[]) => from(players)))
                        .subscribe(player => {
                            this.addOrUpdatePlayer(player);
                        });
                }
            });
    }

    private removePlayer(data: PlayerLeftMap) {
        if (this.players.hasOwnProperty(data.characterId)) {
            this.players[data.characterId].graphics.destroy(true);
            delete this.players[data.characterId];
        }
    }

    private addOrUpdatePlayer(data: { characterId: number, x: number, y: number }) {
        if (!this.players.hasOwnProperty(data.characterId)) {
            this.players[data.characterId] = new Player(this.currentScene, data.x, data.y);
            return;
        }
        this.players[data.characterId].body.reset(data.x, data.y);
    }

    destroy() {
        this.game.events.emit('destroy');
        this.game.destroy(true);
        this.destroyed.emit();
    }
}
