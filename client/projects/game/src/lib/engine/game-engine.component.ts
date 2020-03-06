import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from "@angular/core";
import { ConnectionManager }                                          from "../connection/connection-manager";
import { CharacterOffline }                                           from "../../../../../../server/services/character/actions";
import { GameEngineService }                                          from "./game-engine.service";

@Component({
    selector   : "game-engine",
    templateUrl: "game-engine.component.html",
    styleUrls  : ["game-engine.component.scss"]
})
export class GameEngineComponent implements AfterViewInit, OnDestroy {
    @ViewChild("canvas", { static: true })
    canvas: ElementRef;

    constructor(
        public connection: ConnectionManager,
        public service: GameEngineService
    ) {
    }

    get world() {
        return this.connection.world;
    }

    ngAfterViewInit() {
        this.service.init(this.canvas.nativeElement);
    }

    ngOnDestroy() {
        this.service.destroy();
    }

    signOut() {
        this.service.game.events.emit("game.scene", "title");
        this.world.socket.emit(
            CharacterOffline.event
        );
        this.world.selectedCharacter = null;
    }
}
