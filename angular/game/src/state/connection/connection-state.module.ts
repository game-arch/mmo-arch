import { NgModule }        from '@angular/core'
import { NgxsModule }      from '@ngxs/store'
import { ConnectionState } from './connection.state'

@NgModule({
    imports  : [
        NgxsModule.forFeature([ConnectionState])
    ],
    providers: []
})
export class ConnectionStateModule {

}
