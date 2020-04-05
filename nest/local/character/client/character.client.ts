import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy }        from '@nestjs/microservices'
import { first }              from 'rxjs/operators'
import { Character }    from '../entities/character'
import {
    AllCharactersOffline,
    CharacterOffline,
    CharacterOnline,
    CreateCharacter,
    GetCharacter,
    GetCharacterName,
    GetCharacters
}                       from '../../../../shared/actions/character.actions'
import { LOCAL_CLIENT } from '../../../client/client.module'
import { WorldEvent }   from '../../../lib/event.types'

@Injectable()
export class CharacterClient {

    constructor(@Inject(LOCAL_CLIENT) private client: ClientProxy) {

    }

    async create(accountId: number, world: string, name: string, gender: 'male' | 'female'): Promise<Character> {
        return await this.client.send(new WorldEvent(CreateCharacter.type), new CreateCharacter(accountId, world, name, gender)).pipe(first()).toPromise()
    }

    async getAll(accountId: number, world: string) {
        return await this.client.send(new WorldEvent(GetCharacters.type), new GetCharacters(accountId, world)).pipe(first()).toPromise()
    }

    async characterOnline(id: number, socketId: string) {
        this.client.send(new WorldEvent(CharacterOnline.type), new CharacterOnline(id, socketId)).subscribe()
    }

    async characterOffline(id: number) {
        this.client.send(new WorldEvent(CharacterOffline.type), new CharacterOffline(id)).subscribe()
    }

    async allCharactersOffline(data: CharacterOffline[]) {
        this.client.send(new WorldEvent(AllCharactersOffline.type), new AllCharactersOffline(data)).subscribe()
    }

    async getCharacterName(id: number) {
        return await this.client.send(new WorldEvent(GetCharacterName.type), new GetCharacterName(id)).pipe(first()).toPromise()
    }

    async getCharacter(id: number): Promise<Character> {
        return await this.client.send(new WorldEvent(GetCharacter.type), new GetCharacter(id)).pipe(first()).toPromise()
    }

}
