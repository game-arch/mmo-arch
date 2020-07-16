import { Component }      from '@angular/core'
import { Observable }     from 'rxjs'
import { GameWorld }      from '../../../../../shared/interfaces/game-world'
import { Select, Store }  from '@ngxs/store'
import { LobbyState }     from '../../state/lobby/lobby.state'
import { ConnectToWorld } from '../../../../../shared/actions/connection.actions'

@Component({
    selector   : 'server-list',
    templateUrl: 'server-list.component.html'
})
export class ServerListComponent {

    @Select(LobbyState.worlds)
    servers$: Observable<GameWorld[]>

    constructor(private store: Store) {
    }


    onConnect(world: GameWorld) {
        this.store.dispatch(new ConnectToWorld(world))
    }

}
