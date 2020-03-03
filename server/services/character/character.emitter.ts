import { ClientProxy } from '@nestjs/microservices'
import { Inject, Injectable } from '@nestjs/common'
import { CharacterLoggedIn, CharacterLoggedOut } from './actions'
import { WORLD_PREFIX } from '../world/world.prefix'

@Injectable()
export class CharacterEmitter {
    constructor(@Inject('WORLD_CLIENT') protected client: ClientProxy) {}

    characterLoggedIn(
        id: number,
        gender: 'male' | 'female',
        world: string,
        name: string
    ) {
        this.client.emit(
            WORLD_PREFIX + CharacterLoggedIn.event,
            new CharacterLoggedIn(id, name, world, gender)
        )
    }

    characterLoggedOut(id: number, name: string, world: string) {
        this.client.emit(
            WORLD_PREFIX + CharacterLoggedOut.event,
            new CharacterLoggedOut(id, name, world)
        )
    }
}
