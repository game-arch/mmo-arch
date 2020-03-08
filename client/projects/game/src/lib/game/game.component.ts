import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from "@angular/core";
import { ConnectionManager }                                          from "../connection/connection-manager";
import { CharacterOffline }                                           from "../../../../../../server/services/character/actions";
import { GameEngineService }                                          from "../game-engine/game-engine.service";
import { EventBus }                                                   from "../game-engine/phaser/event-bus";

@Component({
    selector   : "game",
    templateUrl: "game.component.html",
    styleUrls  : ["game.component.scss"]
})
export class GameComponent implements AfterViewInit, OnDestroy {
    @ViewChild("canvas", { static: true })
    canvas: ElementRef;

    constructor(
        public connection: ConnectionManager,
        public engine: GameEngineService
    ) {
    }

    get world() {
        return this.connection.world;
    }

    ngAfterViewInit() {
        this.engine.init(this.canvas.nativeElement);
    }

    ngOnDestroy() {
        this.engine.destroy();
    }

    signOut() {
        this.engine.game.events.emit("game.scene", "title");
        this.world.socket.emit(
            CharacterOffline.event
        );
        this.world.selectedCharacter = null;
    }
}