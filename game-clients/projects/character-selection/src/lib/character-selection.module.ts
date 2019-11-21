import {NgModule}                       from '@angular/core';
import {CharacterSelectionComponent}    from './character-selection.component';
import {ConnectionModule}               from "../../../connection/src/lib/connection.module";
import {MatCardModule}                  from "@angular/material/card";
import {CommonModule}                   from "@angular/common";
import {MatListModule}                  from "@angular/material/list";
import {MatButtonModule}                from "@angular/material/button";
import {MatIconModule, MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer}                   from "@angular/platform-browser";
import {CharacterFormComponent}         from "./character-form.component";
import {MatDialogModule}                from "@angular/material/dialog";
import {ReactiveFormsModule}            from "@angular/forms";
import {MatFormFieldModule}             from "@angular/material/form-field";
import {MatInputModule}                 from "@angular/material/input";
import {MatButtonToggleModule}          from "@angular/material/button-toggle";


@NgModule({
    declarations   : [CharacterSelectionComponent, CharacterFormComponent],
    imports: [
        ConnectionModule,
        MatCardModule,
        CommonModule,
        MatListModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonToggleModule
    ],
    exports        : [CharacterSelectionComponent],
    entryComponents: [CharacterFormComponent]
})
export class CharacterSelectionModule {

    constructor(registry: MatIconRegistry, sanitizer: DomSanitizer) {
        registry.addSvgIcon('male', sanitizer.bypassSecurityTrustResourceUrl('/game/assets/icons/human-male.svg'));
        registry.addSvgIcon('female', sanitizer.bypassSecurityTrustResourceUrl('/game/assets/icons/human-female.svg'));

    }
}
