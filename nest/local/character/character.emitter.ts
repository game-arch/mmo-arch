import {ClientProxy}                                             from '@nestjs/microservices'
import {Inject, Injectable}                                      from '@nestjs/common'
import {CharacterDetails, CharacterLoggedIn, CharacterLoggedOut} from '../../../shared/events/character.events'
import {WORLD_PREFIX}                                            from '../world/world.prefix'
import {Character}                                               from './entities/character'
import {LOCAL_CLIENT}                                            from '../../client/client.module'

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
        instance?:number
    ) {
        this.client.emit(
            WORLD_PREFIX + CharacterLoggedIn.event,
            new CharacterLoggedIn(id, name, world, gender, instance)
        )
    }

    characterDetails(character: Character) {
        this.client.emit(
            WORLD_PREFIX + CharacterDetails.event,
            new CharacterDetails(character)
        )
    }

    characterLoggedOut(id: number, name: string, world: string) {
        this.client.emit(
            WORLD_PREFIX + CharacterLoggedOut.event,
            new CharacterLoggedOut(id, name, world)
        )
    }
}
