import {Component, OnInit}      from '@angular/core';
import {ConnectionManager}      from "../../../connection/src/lib/connection-manager";
import {GameCharacter}          from "../../../../../game-servers/lib/entities/game-character";
import {MatDialog}              from "@angular/material/dialog";
import {CharacterFormComponent} from "./character-form.component";

@Component({
    selector   : 'character-selection',
    templateUrl: 'character-selection.component.html',
    styleUrls  : ['character-selection.component.scss']
})
export class CharacterSelectionComponent implements OnInit {

    selected: GameCharacter = null;

    constructor(
        private connection: ConnectionManager,
        private dialog: MatDialog
    ) {
    }

    ngOnInit() {
    }

    disconnect() {
        if (this.connection.world) {
            this.connection.disconnect(this.connection.world.world.name);
        }
    }

    create() {
        this.dialog.open(CharacterFormComponent);
    }

    join() {
        if (this.connection.world) {
            this.connection.world.selectCharacter(this.selected.name);
        }
    }
}
