import { Component, EventEmitter, OnInit }    from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { HttpClient }                         from '@angular/common/http'
import { Hosts }                              from '../../hosts'
import { first }                              from 'rxjs/operators'

@Component({
    selector   : 'login',
    templateUrl: './login.component.html',
    styleUrls  : ['./login.component.scss'],
    outputs    : ['loggedIn'],
})
export class LoginComponent implements OnInit {
    loggedIn  = new EventEmitter()
    showError = false
    form      = new FormGroup({
        email   : new FormControl('', [Validators.email, Validators.required]),
        password: new FormControl('', [Validators.required]),
    })

    constructor(public http: HttpClient) {
    }

    ngOnInit() {
    }

    async login() {
        try {
            this.showError = false
            const data       = this.form.getRawValue()
            const result     = await this.http.post(Hosts.LOBBY.url + '/login', data).pipe(first()).toPromise()
            this.loggedIn.emit(result)
        } catch (e) {
            if (e.status === 403) {
                this.showError = true
            }
        }
    }

}
