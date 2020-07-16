import { NgModule }   from '@angular/core'
import { NgxsModule } from '@ngxs/store'
import { WorldState } from './world.state'

@NgModule({
    imports: [NgxsModule.forFeature([WorldState])]
})
export class WorldStateModule {

}
