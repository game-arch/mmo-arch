import {NgModule}                    from '@angular/core';
import {CharacterSelectionComponent} from './character-selection.component';
import {ConnectionModule}            from "../../../connection/src/lib/connection.module";
import {MatCardModule}               from "@angular/material/card";
import {CommonModule}                from "@angular/common";


@NgModule({
    declarations: [CharacterSelectionComponent],
    imports: [
        ConnectionModule,
        MatCardModule,
        CommonModule
    ],
    exports     : [CharacterSelectionComponent]
})
export class CharacterSelectionModule {
}
