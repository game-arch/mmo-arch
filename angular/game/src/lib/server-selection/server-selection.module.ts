import { NgModule }                 from '@angular/core'
import { ServerSelectionComponent } from './server-selection.component'
import { MatCardModule }            from '@angular/material/card'
import { ServerListModule }         from './server-list.module'
import { NgxsModule }               from '@ngxs/store'


@NgModule({
    declarations: [ServerSelectionComponent],
    imports     : [
        MatCardModule,
        ServerListModule,
        NgxsModule,
    ],
    exports     : [ServerSelectionComponent],
})
export class ServerSelectionModule {
}
