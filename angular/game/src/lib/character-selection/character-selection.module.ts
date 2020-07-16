import { NgModule }                       from '@angular/core'
import { CharacterSelectionComponent }    from './character-selection.component'
import { MatCardModule }                  from '@angular/material/card'
import { CommonModule }                   from '@angular/common'
import { MatListModule }                  from '@angular/material/list'
import { MatButtonModule }                from '@angular/material/button'
import { MatIconModule, MatIconRegistry } from '@angular/material/icon'
import { DomSanitizer }                   from '@angular/platform-browser'
import { CharacterFormComponent }         from './character-form.component'
import { MatDialogModule }                from '@angular/material/dialog'
import { ReactiveFormsModule }            from '@angular/forms'
import { MatFormFieldModule }             from '@angular/material/form-field'
import { MatInputModule }                 from '@angular/material/input'
import { MatButtonToggleModule }          from '@angular/material/button-toggle'
import { GameEngineModule }               from '../game-engine/game-engine.module'
import { MenusModule }                    from '../menus/menus.module'


@NgModule({
    declarations   : [CharacterSelectionComponent, CharacterFormComponent],
    imports        : [
        MatCardModule,
        CommonModule,
        MatListModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonToggleModule,
        GameEngineModule,
        MenusModule
    ],
    exports        : [CharacterSelectionComponent],
    entryComponents: [CharacterFormComponent]
})
export class CharacterSelectionModule {

    constructor(registry: MatIconRegistry, sanitizer: DomSanitizer) {
        registry.addSvgIcon('male', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/human-male.svg'))
        registry.addSvgIcon('female', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/human-female.svg'))

    }
}
