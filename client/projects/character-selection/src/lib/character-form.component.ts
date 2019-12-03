import {Component, EventEmitter}                                from "@angular/core";
import {ConnectionManager}                                      from "../../../connection/src/lib/connection-manager";
import {FormControl, FormGroup, Validators}                     from "@angular/forms";
import {MatDialogRef}                                           from "@angular/material/dialog";
import {fromEvent}                                              from "rxjs";
import {takeUntil}                                              from "rxjs/operators";
import {CreateCharacter, CharacterCreated, CharacterNotCreated} from "../../../../../server/services/character/actions";

@Component({
    selector   : 'character-form',
    templateUrl: 'character-form.component.html'
})
export class CharacterFormComponent {

    form = new FormGroup({
        name  : new FormControl('', [Validators.required]),
        gender: new FormControl('male', [Validators.required])
    });

    destroy = new EventEmitter();

    constructor(private ref: MatDialogRef<CharacterFormComponent>, private connection: ConnectionManager) {

    }

    ngOnInit() {
        fromEvent(this.connection.world.socket, CharacterCreated.event)
            .pipe(takeUntil(this.destroy))
            .subscribe(() => {
                this.ref.close();
            });
        fromEvent(this.connection.world.socket, CharacterNotCreated.event)
            .pipe(takeUntil(this.destroy))
            .subscribe((data: CharacterNotCreated) => {
                if (data.error.statusCode === 409) {
                    this.form.get('name').setErrors({unique: true});
                }
            });
    }

    submit() {
        this.connection.world.socket.emit(CreateCharacter.event, this.form.getRawValue());
    }

    ngOnDestroy() {
        this.destroy.emit();
    }
}
