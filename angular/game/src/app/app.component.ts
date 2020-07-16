import { Component }         from '@angular/core'
import { Observable }        from 'rxjs'
import { AuthModel }         from '../state/auth/auth.model'
import { Select, Store }     from '@ngxs/store'
import { AuthState }         from '../state/auth/auth.state'
import { SetToken }          from '../state/auth/auth.actions'
import { GameEngineService } from '../lib/game-engine/game-engine.service'
import { ConnectionModel }   from '../state/connection/connection.model'
import { ConnectionState }   from '../state/connection/connection.state'
import { WorldModel }        from '../state/world/world.model'
import { WorldState }        from '../state/world/world.state'
import { ChangeScene }       from '../state/scene/scene.actions'

@Component({
    selector   : 'app-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss']
})
export class AppComponent {
    @Select(AuthState)
    auth$: Observable<AuthModel>
    @Select(ConnectionState)
    connection$: Observable<ConnectionModel>
    @Select(WorldState)
    world$: Observable<WorldModel>

    title = 'game'

    constructor(
        private store: Store,
        public engine: GameEngineService
    ) {

    }

    logout() {
        this.store.dispatch(new SetToken())
        this.store.dispatch(new ChangeScene('title'))
    }
}
