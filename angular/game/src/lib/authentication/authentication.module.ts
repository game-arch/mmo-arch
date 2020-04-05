import { NgModule }                from '@angular/core'
import { AuthenticationComponent } from './authentication.component'
import { LoginComponent }          from './login/login.component'
import { RegisterComponent }       from './register/register.component'
import { MatCardModule }           from '@angular/material/card'
import { MatFormFieldModule }      from '@angular/material/form-field'
import { MatInputModule }          from '@angular/material/input'
import { MatButtonModule }         from '@angular/material/button'
import { MatIconModule }           from '@angular/material/icon'
import { ReactiveFormsModule }     from '@angular/forms'
import { CommonModule }            from '@angular/common'


@NgModule({
    declarations: [
        AuthenticationComponent,
        LoginComponent,
        RegisterComponent
    ],
    imports     : [
        CommonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        ReactiveFormsModule
    ],
    exports     : [AuthenticationComponent]
})
export class AuthenticationModule {
}
