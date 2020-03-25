import { Component, OnInit }      from '@angular/core'
import { ConnectionManager }      from '../connection/connection-manager'
import { GameCharacter }          from '../../../../../shared/interfaces/game-character'
import { MatDialog }              from '@angular/material/dialog'
import { CharacterFormComponent } from './character-form.component'
import { GameEngineService }      from '../game-engine/game-engine.service'

@Component({
    selector   : 'character-selection',
    templateUrl: 'character-selection.component.html',
    styleUrls  : ['character-selection.component.scss']
})
export class CharacterSelectionComponent implements OnInit {
    selected: GameCharacter = null

    constructor(
        private engine: GameEngineService,
        public connection: ConnectionManager,
        private dialog: MatDialog
    ) {
    }

    ngOnInit() {
    }

    disconnect() {
        if (this.connection.world) {
            this.connection.disconnect(this.connection.world.world.name)
        }
    }

    create() {
        this.dialog.open(CharacterFormComponent)
    }

    async join() {
        try {
            if (this.connection.world) {
                await this.connection.world.selectCharacter(
                    this.selected.name,
                    this.selected.id
                )
            }
        } catch (e) {
            console.log(e)
        }
    }
}
