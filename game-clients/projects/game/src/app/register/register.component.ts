import {Component, OnInit}                  from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient}                         from "@angular/common/http";
import {Hosts}                              from "../../lib/hosts";
import {first}                              from "rxjs/operators";

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

    constructor(public http: HttpClient) {
    }

    ngOnInit() {
    }

    async register() {
        try {
            let data   = this.form.getRawValue();
            let result = await this.http.post(Hosts.ACCOUNT + '/register', data).pipe(first()).toPromise();
        } catch (e) {
            if (e.status === 409) {
                this.form.get('email').setErrors({taken:true});
            }
        }
    }
}
