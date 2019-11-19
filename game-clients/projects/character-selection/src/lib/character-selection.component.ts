import {Component, OnInit} from '@angular/core';
import {ConnectionManager} from "../../../connection/src/lib/connection-manager";

@Component({
    selector   : 'character-selection',
    templateUrl: 'character-selection.component.html',
    styles     : []
})
export class CharacterSelectionComponent implements OnInit {

    constructor(private connection: ConnectionManager) {
    }

    ngOnInit() {
    }

}
