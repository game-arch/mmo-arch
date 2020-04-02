import { ClientProxy }                           from '@nestjs/microservices'
import { Inject, Injectable }                    from '@nestjs/common'
import { CharacterLoggedIn, CharacterLoggedOut } from '../../../shared/events/character.events'
import { LOCAL_CLIENT } from '../../client/client.module'
import { WorldEvent }   from '../world/event.types'

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
        name: string,
        instance?: number
    ) {
        this.client.emit(
            new WorldEvent(CharacterLoggedIn.event),
            new CharacterLoggedIn(id, name, world, gender, instance)
        )
    }

    characterLoggedOut(id: number, name: string, world: string) {
        this.client.emit(
            new WorldEvent(CharacterLoggedOut.event),
            new CharacterLoggedOut(id, name, world)
        )
    }
}
