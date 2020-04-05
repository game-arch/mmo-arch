import { NgModule }   from '@angular/core'
import { NgxsModule } from '@ngxs/store'
import { MapService } from './map.service'
import { MapsState }  from './maps.state'

@NgModule({
    imports  : [
        NgxsModule.forFeature([MapsState])
    ],
    providers: [MapService]
})
export class MapStateModule {

}
