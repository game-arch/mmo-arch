import { Action, Selector, State, StateContext } from '@ngxs/store'
import { LobbyModel }                            from './lobby.model'
import { LobbyConnected }                        from '../../../../../shared/actions/connection.actions'
import { GetWorlds }                             from '../../../../../shared/actions/server-presence.actions'
import { Injectable }                            from '@angular/core'
import Socket = SocketIOClient.Socket

@State<LobbyModel>({
    name    : 'lobby',
    defaults: new LobbyModel()
})
@Injectable()
export class LobbyState {
    @Selector()
    static worlds(state: LobbyModel) {
        return state.worlds
    }

    @Action(LobbyConnected)
    onLobbyConnected(context: StateContext<LobbyModel>, action: LobbyConnected) {
        (action.socket as Socket).on(GetWorlds.type, (data) => {
            context.dispatch(new GetWorlds(data.worlds))
        })
    }

    @Action(GetWorlds)
    onGetWorlds(context: StateContext<LobbyModel>, action: GetWorlds) {
        context.patchState({
            worlds: action.worlds
        })
    }
}
