import { AuthModel }                               from './auth.model'
import { Action, NgxsOnInit, State, StateContext } from '@ngxs/store'
import { SetToken }                                from './auth.actions'
import { Injectable }                              from '@angular/core'

@State<AuthModel>({
    name    : 'auth',
    defaults: {
        token: ''
    }
})
@Injectable()
export class AuthState implements NgxsOnInit {

    @Action(SetToken)
    setToken(context: StateContext<AuthModel>, { token }: SetToken) {
        context.setState({ token })
    }

    ngxsOnInit(context?: StateContext<any>): void | any {
        if (context) {
            context.dispatch(new SetToken(context.getState().token))
        }
    }
}
