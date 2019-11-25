import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ConnectionManager}                                       from "../../../connection/src/lib/connection-manager";
import {CharacterOffline}                                        from "../../../../../game-servers/lib/actions";
import {Game}                                                    from 'phaser';
import {GAME_CONFIG}                                             from "./phaser/config";

@Component({
    selector   : 'game-engine',
    templateUrl: 'game-engine.component.html',
    styles     : []
})
export class GameEngineComponent implements AfterViewInit {

    game: Game;
    @ViewChild('canvas', {static: true})
    canvas: ElementRef;

    get world() {
        return this.connection.world;
    }

    constructor(public connection: ConnectionManager) {
    }

    ngAfterViewInit() {
        this.game = new Game({...GAME_CONFIG, canvas: this.canvas.nativeElement});
    }

    signOut() {
        this.world.socket.emit(CharacterOffline.event, {name: this.world.selectedCharacter});
        this.world.selectedCharacter = '';
    }
}
