import {Component, OnInit}                  from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
    selector   : 'register',
    templateUrl: './register.component.html',
    styleUrls  : ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

    form = new FormGroup({
        email          : new FormControl('', [Validators.email, Validators.required]),
        password       : new FormControl('', [Validators.required]),
        confirmPassword: new FormControl('', [Validators.required, control => this.form && control.value !== this.form.get('password').value ? {match: true} : {}])
    });

    constructor() {
    }

    ngOnInit() {
    }

}
