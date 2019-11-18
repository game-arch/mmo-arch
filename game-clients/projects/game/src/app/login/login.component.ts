import {Component, OnInit}                  from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient}                         from "@angular/common/http";
import {Hosts}                              from "../../lib/hosts";
import {first}                              from "rxjs/operators";

@Component({
    selector   : 'login',
    templateUrl: './login.component.html',
    styleUrls  : ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    isLogin   = true;
    showError = false;
    form      = new FormGroup({
        email   : new FormControl('', [Validators.email, Validators.required]),
        password: new FormControl('', [Validators.required])
    });

    constructor(public http: HttpClient) {
    }

    ngOnInit() {
    }

    async login() {
        try {
            this.showError = false;
            let data       = this.form.getRawValue();
            let result     = await this.http.post(Hosts.LOBBY + '/login', data).pipe(first()).toPromise();
        } catch (e) {
            if (e.status === 403) {
                this.showError = true;
            }
        }
    }

}
