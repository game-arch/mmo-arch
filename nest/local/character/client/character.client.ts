import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy }        from '@nestjs/microservices'
import { first }              from 'rxjs/operators'
import { Character }          from '../entities/character'
import {
    AllCharactersOffline,
    CharacterOffline,
    CharacterOnline,
    CreateCharacter,
    GetCharacter,
    GetCharacterName,
    GetCharacters
}                             from '../../../../shared/events/character.events'
import { LOCAL_CLIENT } from '../../../client/client.module'
import { WorldEvent }   from '../../world/event.types'

@Injectable()
export class CharacterClient {

    constructor(@Inject(LOCAL_CLIENT) private client: ClientProxy) {

    }

    async create(accountId: number, world: string, name: string, gender: 'male' | 'female'): Promise<Character> {
        return await this.client.send(new WorldEvent(CreateCharacter.event), new CreateCharacter(accountId, world, name, gender)).pipe(first()).toPromise()
    }

    async getAll(accountId: number, world: string) {
        return await this.client.send(new WorldEvent(GetCharacters.event), new GetCharacters(accountId, world)).pipe(first()).toPromise()
    }

    async characterOnline(id: number, socketId: string, channel?: number) {
        this.client.send(new WorldEvent(CharacterOnline.event), new CharacterOnline(id, socketId, channel)).subscribe()
    }

    async characterOffline(id: number) {
        this.client.send(new WorldEvent(CharacterOffline.event), new CharacterOffline(id)).subscribe()
    }

    async allCharactersOffline(data: CharacterOffline[]) {
        this.client.send(new WorldEvent(AllCharactersOffline.event), new AllCharactersOffline(data)).subscribe()
    }

    async getCharacterName(id: number) {
        return await this.client.send(new WorldEvent(GetCharacterName.event), new GetCharacterName(id)).pipe(first()).toPromise()
    }

    async getCharacter(id: number): Promise<Character> {
        return await this.client.send(new WorldEvent(GetCharacter.event), new GetCharacter(id)).pipe(first()).toPromise()
    }

}
