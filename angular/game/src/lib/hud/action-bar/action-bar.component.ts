import { Component }             from '@angular/core'
import { Observable }            from 'rxjs'
import { OverloadedModel }       from '../../../state/command/overloaded.model'
import { OverloadedActionState } from '../../../state/command/states/overloaded-action.state'
import { Select, Store }         from '@ngxs/store'
import { OverloadedAction }      from '../../../state/command/command.actions'

@Component({
    selector   : 'action-bar',
    templateUrl: 'action-bar.component.html',
    styleUrls  : ['action-bar.component.scss']
})
export class ActionBarComponent {
    @Select(OverloadedActionState)
    overloaded$: Observable<OverloadedModel>
    skill = 'skill'

    constructor(private store: Store) {
    }

    performOverloadedAction() {
        this.store.dispatch(new OverloadedAction(false))
    }

}
