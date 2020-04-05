import { Component, OnInit }      from '@angular/core'
import { GameCharacter }          from '../../../../../shared/interfaces/game-character'
import { MatDialog }              from '@angular/material/dialog'
import { CharacterFormComponent } from './character-form.component'
import { Select, Store }          from '@ngxs/store'
import { DisconnectFromWorld }    from '../../../../../shared/actions/connection.actions'
import { CharacterOnline }        from '../../../../../shared/actions/character.actions'
import { Observable }             from 'rxjs'
import { WorldModel }             from '../../state/world/world.model'
import { WorldState }             from '../../state/world/world.state'

@Component({
    selector   : 'character-selection',
    templateUrl: 'character-selection.component.html',
    styleUrls  : ['character-selection.component.scss']
})
export class CharacterSelectionComponent implements OnInit {
    selected: GameCharacter = null
    @Select(WorldState)
    world$: Observable<WorldModel>

    constructor(
        private dialog: MatDialog,
        private store: Store
    ) {
    }

    ngOnInit() {
    }

    disconnect() {
        this.store.dispatch(new DisconnectFromWorld())
    }

    create() {
        this.dialog.open(CharacterFormComponent)
    }


    async join() {
        this.store.dispatch(new CharacterOnline(this.selected.id))
    }
}
