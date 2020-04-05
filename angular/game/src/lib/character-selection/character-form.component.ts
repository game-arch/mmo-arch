import { Component, EventEmitter, OnDestroy, OnInit }             from '@angular/core'
import { FormControl, FormGroup, Validators }                     from '@angular/forms'
import { MatDialogRef }                                           from '@angular/material/dialog'
import { CharacterCreated, CharacterNotCreated, CreateCharacter } from '../../../../../shared/actions/character.actions'
import { Store }                                                  from '@ngxs/store'
import { WorldState }                                             from '../../state/world/world.state'
import { WorldModel }                                             from '../../state/world/world.model'

@Component({
    selector   : 'character-form',
    templateUrl: 'character-form.component.html'
})
export class CharacterFormComponent implements OnInit, OnDestroy {

    form = new FormGroup({
        name  : new FormControl('', [Validators.required]),
        gender: new FormControl('male', [Validators.required])
    })

    destroy = new EventEmitter()

    closeListener = () => this.ref.close()
    errorListener = (data: CharacterNotCreated) => {
        if (data.error.statusCode === 409) {
            this.form.get('name').setErrors({ unique: true })
        }
    }

    constructor(private ref: MatDialogRef<CharacterFormComponent>, private store: Store) {

    }

    ngOnInit() {
        let world: WorldModel = this.store.selectSnapshot(WorldState)
        world.socket.on(CharacterCreated.type, this.closeListener)
        world.socket.on(CharacterNotCreated.type, this.errorListener)
    }

    submit() {
        let world: WorldModel = this.store.selectSnapshot(WorldState)
        world.socket.emit(CreateCharacter.type, this.form.getRawValue())
    }

    ngOnDestroy() {
        let world: WorldModel = this.store.selectSnapshot(WorldState)
        world.socket.removeEventListener(CharacterCreated.type, this.closeListener)
        world.socket.removeEventListener(CharacterNotCreated.type, this.errorListener)

        this.destroy.emit()
    }
}
