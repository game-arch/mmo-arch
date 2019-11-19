import {Component, OnInit} from '@angular/core';
import {ConnectionManager} from "../../../connection/src/lib/connection-manager";
import {GameCharacter}     from "../../../../../game-servers/lib/entities/game-character";

@Component({
    selector   : 'character-selection',
    templateUrl: 'character-selection.component.html',
    styleUrls  : ['character-selection.component.scss']
})
export class CharacterSelectionComponent implements OnInit {

    selected: GameCharacter = null;

    constructor(private connection: ConnectionManager) {
    }

    ngOnInit() {
    }

    disconnect() {
        if (this.connection.world) {
            this.connection.disconnect(this.connection.world.shard.name);
        }
    }
}
