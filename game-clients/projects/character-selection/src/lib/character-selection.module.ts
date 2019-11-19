import {NgModule}                    from '@angular/core';
import {CharacterSelectionComponent} from './character-selection.component';
import {ConnectionModule}            from "../../../connection/src/lib/connection.module";
import {MatCardModule}               from "@angular/material/card";
import {CommonModule}                from "@angular/common";
import {MatListModule}               from "@angular/material/list";


@NgModule({
    declarations: [CharacterSelectionComponent],
    imports: [
        ConnectionModule,
        MatCardModule,
        CommonModule,
        MatListModule
    ],
    exports     : [CharacterSelectionComponent]
})
export class CharacterSelectionModule {
}
