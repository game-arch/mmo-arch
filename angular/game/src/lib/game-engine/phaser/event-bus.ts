import { GameEngineService }   from '../game-engine.service'
import { PlayerDirections }    from '../../../../../../shared/actions/map.actions'
import { MultiplayerScene }    from './scenes/multiplayer.scene'
import { Observable, Subject } from 'rxjs'
import { Injectable }          from '@angular/core'
import { WorldModel }          from '../../../state/world/world.model'
import { Select, Store }       from '@ngxs/store'
import { WorldState }          from '../../../state/world/world.state'

@Injectable()
export class EventBus {
    stop = new Subject()

    @Select(WorldState)
    world$: Observable<WorldModel>

    constructor(private store: Store, private engine: GameEngineService) {
    }

    listen() {
        this.stop.next()
        this.joystickEvents()
    }


    private joystickEvents() {
        this.engine.game.events.on('input.joystick', directions => {
            if (this.engine.currentScene instanceof MultiplayerScene) {
                for (const dir of Object.keys(
                    this.engine.currentScene.directions
                )) {
                    this.engine.currentScene.directions[dir] = directions[dir]
                }
                this.store.dispatch(new PlayerDirections())
            }
        })
    }

}
