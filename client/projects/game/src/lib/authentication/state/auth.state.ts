import {AuthModel}                   from "./auth.model";
import {Action, State, StateContext} from "@ngxs/store";
import {SetToken}                    from "./auth.actions";

@State<AuthModel>({
    name    : 'auth',
    defaults: {
        token    : ''
    }
})
export class AuthState {

    @Action(SetToken)
    setToken(context: StateContext<AuthModel>, {token}: SetToken) {
        context.setState({token});
    }

}
