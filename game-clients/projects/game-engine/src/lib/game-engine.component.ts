import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {ConnectionManager}                                          from "../../../connection/src/lib/connection-manager";
import {CharacterOffline}                                           from "../../../../../game-servers/services/character/actions";
import {GameEngineService}                                          from "./game-engine.service";

@Component({
    selector   : 'game-engine',
    templateUrl: 'game-engine.component.html',
    styleUrls  : ['game-engine.component.scss']
})
export class GameEngineComponent implements AfterViewInit, OnDestroy {
    @ViewChild('canvas', {static: true})
    canvas: ElementRef;

    get world() {
        return this.connection.world;
    }

    constructor(public connection: ConnectionManager, public service: GameEngineService) {
    }

    ngAfterViewInit() {
        this.service.init(this.canvas.nativeElement);
    }

    ngOnDestroy() {
        this.service.destroy();
    }

    signOut() {
        this.service.game.events.emit('game.scene', 'title');
        this.world.socket.emit(CharacterOffline.event, new CharacterOffline(this.world.selectedCharacter.id));
        this.world.selectedCharacter = null;
    }
}
