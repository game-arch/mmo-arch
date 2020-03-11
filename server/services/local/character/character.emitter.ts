import { ClientProxy }                                             from '@nestjs/microservices'
import { Inject, Injectable }                                      from '@nestjs/common'
import { CharacterDetails, CharacterLoggedIn, CharacterLoggedOut } from './actions'
import { WORLD_PREFIX }                                            from '../world/world.prefix'
import { MapClient }                                               from '../map/client/map.client'
import { Character }                                               from './entities/character'

@Injectable()
export class CharacterEmitter {
    constructor(
        @Inject('WORLD_CLIENT') protected client: ClientProxy,
        protected map: MapClient,
    ) {
    }

    characterLoggedIn(
        id: number,
        gender: 'male' | 'female',
        world: string,
        name: string,
    ) {
        this.map.client.emit(
            WORLD_PREFIX + CharacterLoggedIn.event,
            new CharacterLoggedIn(id, name, world, gender),
        )
        this.client.emit(
            WORLD_PREFIX + CharacterLoggedIn.event,
            new CharacterLoggedIn(id, name, world, gender),
        )
    }

    characterDetails(character: Character) {
        this.client.emit(
            WORLD_PREFIX + CharacterDetails.event,
            new CharacterDetails(character.toJSON()),
        )
    }

    characterLoggedOut(id: number, name: string, world: string) {
        this.map.client.emit(
            WORLD_PREFIX + CharacterLoggedOut.event,
            new CharacterLoggedOut(id, name, world),
        )
        this.client.emit(
            WORLD_PREFIX + CharacterLoggedOut.event,
            new CharacterLoggedOut(id, name, world),
        )
    }
}
