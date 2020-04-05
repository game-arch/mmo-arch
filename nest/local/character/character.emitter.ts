import { ClientProxy }                           from '@nestjs/microservices'
import { Inject, Injectable }                    from '@nestjs/common'
import { CharacterLoggedIn, CharacterLoggedOut } from '../../../shared/actions/character.actions'
import { LOCAL_CLIENT } from '../../client/client.module'
import { WorldEvent }   from '../../lib/event.types'

@Injectable()
export class CharacterEmitter {
    constructor(
        @Inject(LOCAL_CLIENT) protected client: ClientProxy
    ) {
    }

    characterLoggedIn(
        id: number,
        gender: 'male' | 'female',
        world: string,
        name: string
    ) {
        this.client.emit(
            new WorldEvent(CharacterLoggedIn.type),
            new CharacterLoggedIn(id, name, world, gender)
        )
    }

    characterLoggedOut(id: number, name: string, world: string) {
        this.client.emit(
            new WorldEvent(CharacterLoggedOut.type),
            new CharacterLoggedOut(id, name, world)
        )
    }
}
