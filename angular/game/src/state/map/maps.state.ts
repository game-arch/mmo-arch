import { Action, State, StateContext, Store }        from '@ngxs/store'
import { MapsModel }                                 from './maps.model'
import { NpcUpdate, PlayerDirections, PlayerUpdate } from '../../../../../shared/actions/map.actions'
import { Injectable }                                from '@angular/core'

@State<MapsModel>({
    name    : 'game',
    defaults: new MapsModel()
})
@Injectable()
export class MapsState {

    constructor(private store: Store) {
    }
    @Action(PlayerDirections)
    onPlayerDirections(context: StateContext<MapsModel>, action: PlayerDirections) {

    }

    @Action(PlayerUpdate)
    onPlayerUpdate(context: StateContext<MapsModel>, action: PlayerUpdate) {

    }

    @Action(NpcUpdate)
    onNpcUpdate(context: StateContext<MapsModel>, action: NpcUpdate) {

    }
}
