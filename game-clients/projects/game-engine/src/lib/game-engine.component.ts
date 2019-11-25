import {Component, OnInit} from '@angular/core';
import {ConnectionManager} from "../../../connection/src/lib/connection-manager";
import {CharacterOffline}  from "../../../../../game-servers/lib/actions";
import {Game}              from 'phaser';

@Component({
    selector   : 'game-engine',
    templateUrl: 'game-engine.component.html',
    styles     : []
})
export class GameEngineComponent implements OnInit {

    game: Game;

    get world() {
        return this.connection.world;
    }

    constructor(public connection: ConnectionManager) {
    }

    ngOnInit() {
    }

    signOut() {
        this.world.socket.emit(CharacterOffline.event, {name: this.world.selectedCharacter});
        this.world.selectedCharacter = '';
    }
}
