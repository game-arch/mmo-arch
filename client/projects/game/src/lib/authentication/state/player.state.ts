import { PlayerModel }                      from "./player.model";
import { Action, State, StateContext }      from "@ngxs/store";
import { SetCharacter, SetToken, SetWorld } from "./player.actions";

@State<PlayerModel>({
    name    : "player",
    defaults: {
        token    : "",
        world    : "",
        character: ""
    }
})
export class PlayerState {

    @Action(SetToken)
    setToken(context: StateContext<PlayerModel>, { token }: SetToken) {
        context.setState({ token, character: "", world: "" });
    }

    @Action(SetWorld)
    setWorld(context: StateContext<PlayerModel>, { name }: SetWorld) {
        context.patchState({ world: name });
    }

    @Action(SetCharacter)
    setCharacter(context: StateContext<PlayerModel>, { name }: SetCharacter) {
        context.patchState({ character: name });
    }

}
