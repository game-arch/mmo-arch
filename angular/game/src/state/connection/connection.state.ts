import { Action, State, StateContext, Store } from '@ngxs/store'
import {
    ConnectToWorld,
    DisconnectFromWorld,
    LobbyConnected,
    LobbyDisconnected,
    WorldConnected,
    WorldDisconnected
}                                             from '../../../../../shared/actions/connection.actions'
import { ConnectionModel }                    from './connection.model'
import { SetToken }                           from '../auth/auth.actions'
import * as io                                from 'socket.io-client'
import { environment }                        from '../../environments/environment'
import * as parser                            from 'socket.io-msgpack-parser'
import { Injectable }                         from '@angular/core'

@State<ConnectionModel>({
    name    : 'connection',
    defaults: new ConnectionModel()
})
@Injectable()
export class ConnectionState {

    constructor(private store: Store) {
    }

    @Action(SetToken)
    onSetToken(context: StateContext<ConnectionModel>, action: SetToken) {
        let state    = context.getState()
        let newState = new ConnectionModel()
        if (!!action.token) {
            newState.token = action.token
            newState.lobby = io.connect('http://' + environment.host + ':' + environment.port + '?token=' + action.token, {
                transports  : ['websocket'],
                reconnection: true,
                parser
            } as any)
            if (newState.lobby) {
                newState.lobby.on('reconnect_attempt', () => {
                    newState.lobby.io.opts.transports = ['websocket']
                })
                newState.lobby.on('connect', () => context.dispatch(new LobbyConnected(newState.lobby)))
                newState.lobby.on('disconnect', () => context.dispatch(new LobbyDisconnected()))
                newState.lobby.on('connect-error', () => context.dispatch(new SetToken()))
            }

        } else {
            if (state.lobby) {
                context.dispatch(new LobbyDisconnected())
            }
        }
        if (state.world) {
            context.dispatch(new WorldDisconnected())
        }
        context.setState(newState)
    }


    @Action(ConnectToWorld)
    onConnectToWorld(context: StateContext<ConnectionModel>, action: ConnectToWorld) {
        let state = context.getState()
        let world = io.connect('http://' + action.world.host + ':' + action.world.port + '/world' + '?token=' + state.token, {
            transports  : ['websocket'],
            reconnection: true,
            parser
        } as any)
        if (world) {
            world.on('reconnect_attempt', () => {
                world.io.opts.transports = ['websocket']
            })
            world.on('connect', () => context.dispatch(new WorldConnected(world, action.world.name)))
            world.on('disconnect', () => context.dispatch(new WorldDisconnected()))
            world.on('connect-error', () => context.dispatch(new SetToken()))
        }
        context.patchState({
            world
        })
    }

    @Action(DisconnectFromWorld)
    onDisconnectFromWorld(context: StateContext<ConnectionModel>, action: DisconnectFromWorld) {
        let state = context.getState()
        state.world.close()
        state.world.removeAllListeners()
        context.patchState({
            world: null
        })
    }

    @Action(WorldConnected)
    onWorldConnected(context: StateContext<ConnectionModel>, action: WorldConnected) {
        context.getState().lobby.close()
        context.getState().lobby.removeAllListeners()
    }

    @Action(WorldDisconnected)
    onWorldDisconnected(context: StateContext<ConnectionModel>, action: WorldDisconnected) {
        context.getState().lobby.connect()
        if (context.getState().world) {
            context.getState().world.removeAllListeners()
        }
    }

    @Action(LobbyConnected)
    onLobbyConnected(context: StateContext<ConnectionModel>, action: LobbyConnected) {

    }

    @Action(LobbyDisconnected)
    onLobbyDisconnected(context: StateContext<ConnectionModel>, action: LobbyDisconnected) {

    }

}
