import { EventEmitter, Injectable } from "@angular/core";
import { ConnectionManager }        from "../connection/connection-manager";
import { GAME_CONFIG }              from "./phaser/config";
import { SceneFactory }             from "./phaser/scenes/scene-factory.service";
import { fromEvent }                from "rxjs";
import { filter, takeUntil, tap }   from "rxjs/operators";
import { TitleScene }               from "./phaser/scenes/title/title.scene";
import { PreloadScene }             from "./phaser/scenes/preload/preload.scene";
import { TutorialScene }            from "./phaser/scenes/tutorial/tutorial.scene";
import {
    AllPlayers,
    PlayerEnteredMap,
    PlayerLeftMap,
    PlayerUpdate
}                                   from "../../../../../../server/services/map/actions";
import { MultiplayerScene }         from "./phaser/scenes/multiplayer.scene";
import { WorldConnection }          from "../connection/world-connection";
import { EventBus }                 from "./phaser/event-bus";
import Game = Phaser.Game;

@Injectable()
export class GameEngineService {
    loading           = 0;
    game: Game;
    scenes: {
        preload: PreloadScene
        title: TitleScene
        tutorial: TutorialScene
    }                 = {
        preload : null,
        title   : null,
        tutorial: null
    };
    currentSceneKey   = "preload";
    currentScene: MultiplayerScene;
    private destroyed = new EventEmitter();

    worldChange = new EventEmitter();

    eventBus = new EventBus(this);

    constructor(
        public sceneFactory: SceneFactory,
        public connection: ConnectionManager
    ) {
    }

    init(canvas: HTMLCanvasElement) {
        this.game = new Game({ ...GAME_CONFIG, canvas });
        this.connection.worldChange
            .pipe(takeUntil(this.destroyed))
            .pipe(filter(world => !!world.socket))
            .pipe(tap(world => (this.connection.world = world)))
            .subscribe(world => {
                this.worldChange.emit();
                this.convertEvents(world, [
                    PlayerEnteredMap.event,
                    PlayerLeftMap.event,
                    AllPlayers.event,
                    PlayerUpdate.event
                ]);
            });
        this.createScenes();
        this.eventBus.listen();
        fromEvent(window, "resize")
            .pipe(takeUntil(this.destroyed))
            .subscribe(() =>
                this.game.events.emit(
                    "resize",
                    window.innerWidth,
                    window.innerHeight
                )
            );
    }

    createScenes() {
        this.scenes.preload  = this.sceneFactory.preload();
        this.scenes.title    = this.sceneFactory.title();
        this.scenes.tutorial = this.sceneFactory.tutorial();
        this.game.scene.add("preload", this.scenes.preload);
        this.game.scene.add("title", this.scenes.title);
        this.game.scene.add("tutorial", this.scenes.tutorial);
    }

    convertEvent(world: WorldConnection, eventName: string) {
        fromEvent(world.socket, eventName)
            .pipe(takeUntil(this.worldChange))
            .subscribe(event => {
                this.game.events.emit(eventName, event);
            });
    }

    convertEvents(world: WorldConnection, eventNames: string[]) {
        for (let eventName of eventNames) {
            this.convertEvent(world, eventName);
        }
    }

    destroy() {
        this.game.events.emit("destroy");
        this.game.destroy(true);
        this.destroyed.emit();
    }
}
