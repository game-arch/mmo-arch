import {Component, OnInit}                  from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
    selector   : 'login',
    templateUrl: './login.component.html',
    styleUrls  : ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    login = true;
    form = new FormGroup({
        email   : new FormControl('', [Validators.email, Validators.required]),
        password: new FormControl('', [Validators.required])
    });

    constructor() {
    }

    ngOnInit() {
    }

}
