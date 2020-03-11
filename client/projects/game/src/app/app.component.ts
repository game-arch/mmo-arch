import { Component }         from '@angular/core'
import { Observable }        from 'rxjs'
import { AuthModel }         from '../lib/authentication/state/auth.model'
import { Select, Store }     from '@ngxs/store'
import { AuthState }         from '../lib/authentication/state/auth.state'
import { ConnectionManager } from '../lib/connection/connection-manager'
import { SetToken }          from '../lib/authentication/state/auth.actions'
import { GameEngineService } from '../lib/game-engine/game-engine.service'

@Component({
    selector   : 'app-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss']
})
export class AppComponent {
    @Select(AuthState)
    auth$: Observable<AuthModel>

    title = 'game'

    constructor(
        private store: Store,
        public connection: ConnectionManager,
        public engine: GameEngineService
    ) {

    }

    logout() {
        this.store.dispatch(new SetToken())
        this.engine.game.events.emit('game.scene', 'title')
    }
}
