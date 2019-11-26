import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {ConnectionManager}                                          from "../../../connection/src/lib/connection-manager";
import {CharacterOffline}                                           from "../../../../../game-servers/lib/actions";
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
        this.world.socket.emit(CharacterOffline.event, {name: this.world.selectedCharacter});
        this.world.selectedCharacter = '';
    }
}
