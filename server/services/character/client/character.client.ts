import {Inject, Injectable} from "@nestjs/common";
import {ClientProxy}        from "@nestjs/microservices";
import {first}              from "rxjs/operators";
import {Character}          from "../entities/character";
import {
    AllCharactersOffline,
    CreateCharacter,
    GetCharacters,
    CharacterOffline,
    CharacterOnline, GetCharacter, GetCharacterName
}                           from "../actions";
import {WORLD_PREFIX}       from "../../world/world.prefix";
import {LocalMessage}       from "../../world/chat/actions";

@Injectable()
export class CharacterClient {

    constructor(@Inject('CHARACTER_CLIENT') private client: ClientProxy) {

    }

    async create(accountId: number, world: string, name: string, gender: 'male' | 'female'): Promise<Character> {
        return await this.client.send(WORLD_PREFIX + CreateCharacter.event, new CreateCharacter(accountId, world, name, gender)).pipe(first()).toPromise();
    }

    async getAll(accountId: number, world: string) {
        return await this.client.send(WORLD_PREFIX + GetCharacters.event, new GetCharacters(accountId, world)).pipe(first()).toPromise();
    }

    async characterOnline(id: number, socketId:string) {
        this.client.send(WORLD_PREFIX + CharacterOnline.event, new CharacterOnline(id, socketId)).subscribe();
    }

    async characterOffline(id: number) {
        this.client.send(WORLD_PREFIX + CharacterOffline.event, new CharacterOffline(id)).subscribe();
    }

    async allCharactersOffline(data: CharacterOffline[]) {
         this.client.send(WORLD_PREFIX + AllCharactersOffline.event, new AllCharactersOffline(data)).subscribe();
    }

    async getCharacterName(id: number) {
        return await this.client.send(WORLD_PREFIX + GetCharacterName.event, new GetCharacterName(id)).pipe(first()).toPromise();
    }

    async getCharacter(id: number): Promise<Character> {
        return await this.client.send(WORLD_PREFIX + GetCharacter.event, new GetCharacter(id)).pipe(first()).toPromise();
    }

}
