import { State, Store } from '@ngxs/store'

@State({
    name: 'command'
})
export class CommandState {

    constructor(private store: Store) {
    }
}
