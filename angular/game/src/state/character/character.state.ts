import { Action, State, StateContext, Store } from '@ngxs/store'
import { CharacterModel }                     from './character.model'
import { CharacterOffline, CharacterOnline }  from '../../../../../shared/actions/character.actions'

@State<CharacterModel>({
    name    : 'character',
    defaults: new CharacterModel()
})
export class CharacterState {

    constructor(private store: Store) {
    }
    @Action(CharacterOnline)
    onCharacterOnline(context: StateContext<CharacterModel>, action: CharacterOnline) {

    }

    @Action(CharacterOffline)
    onCharacterOffline(context: StateContext<CharacterModel>, action: CharacterOffline) {

    }
}
