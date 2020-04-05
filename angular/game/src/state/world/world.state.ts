import { Action, State, StateContext }         from '@ngxs/store'
import { WorldModel }                          from './world.model'
import { WorldConnected, WorldDisconnected }   from '../../../../../shared/actions/connection.actions'
import { CharacterOnline, ReceivedCharacters } from '../../../../../shared/actions/character.actions'
import { MapChannels }                         from '../../../../../shared/actions/map.actions'
import { Injectable }                          from '@angular/core'

@State<WorldModel>({
    name    : 'world',
    defaults: new WorldModel()
})
@Injectable()
export class WorldState {

    @Action(WorldConnected)
    onWorldConnected(context: StateContext<WorldModel>, action: WorldConnected) {
        let state    = new WorldModel()
        state.name   = action.name
        state.socket = action.socket
        state.socket.on(MapChannels.type, (data: MapChannels) => context.dispatch(new MapChannels(data.characterId, data.map, data.channels)))

        context.setState(state)
    }

    @Action(MapChannels)
    onMapChannels(context: StateContext<WorldModel>, action: MapChannels) {
        context.patchState({
            channels: action.channels
        })
    }

    @Action(WorldDisconnected)
    onWorldDisconnected(context: StateContext<WorldModel>, action: WorldDisconnected) {
        context.setState(new WorldModel())
    }

    @Action(CharacterOnline)
    onCharacterSelected(context: StateContext<WorldModel>, action: CharacterOnline) {
        let state = context.getState()
        state.socket.emit(CharacterOnline.type, action, data => {
            if (data.status === 'success') {
                context.patchState({
                    character: action.characterId
                })
            }
        })
    }

    @Action(ReceivedCharacters)
    onGetCharacters(context: StateContext<WorldModel>, action: ReceivedCharacters) {
        context.patchState({
            characters: action.characters
        })
    }
}
