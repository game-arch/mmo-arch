import {Component, EventEmitter}            from "@angular/core";
import {ConnectionManager}                  from "../../../connection/src/lib/connection-manager";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Events}                             from "../../../../../game-servers/lib/constants/events";
import {MatDialogRef}                       from "@angular/material/dialog";
import {fromEvent}                          from "rxjs";
import {takeUntil}                          from "rxjs/operators";

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
        fromEvent(this.connection.world.socket, Events.CHARACTER_CREATED)
            .pipe(takeUntil(this.destroy))
            .subscribe(() => {
                this.ref.close();
            });
        fromEvent(this.connection.world.socket, Events.CHARACTER_NOT_CREATED)
            .pipe(takeUntil(this.destroy))
            .subscribe((data: any) => {
                if (data.statusCode === 409) {
                    this.form.get('name').setErrors({unique: true});
                }
            });
    }

    submit() {
        this.connection.world.socket.emit(Events.CREATE_CHARACTER, this.form.getRawValue());
    }

    ngOnDestroy() {
        this.destroy.emit();
    }
}
