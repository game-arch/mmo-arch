import {Injectable}  from "@nestjs/common";
import {ClientProxy} from "@nestjs/microservices";
import {first}       from "rxjs/operators";
import {Character}   from "../entities/character";
import {
    AllCharactersOffline,
    CharacterCreate,
    GetCharacters,
    CharacterOffline,
    CharacterOnline, GetCharacter, GetCharacterName
}                    from "../actions";

@Injectable()
export class CharacterClient {

    constructor(private client: ClientProxy) {

    }

    async create(accountId: number, world: string, name: string, gender: 'male' | 'female'): Promise<Character> {
        return await this.client.send(CharacterCreate.event, new CharacterCreate(accountId, world, name, gender)).pipe(first()).toPromise();
    }

    async getAll(accountId: number, world: string) {
        return await this.client.send(GetCharacters.event, new GetCharacters(accountId, world)).pipe(first()).toPromise();
    }

    characterOnline(id: number) {
        this.client.emit(CharacterOnline.event, new CharacterOnline(id));
    }

    characterOffline(id: number) {
        this.client.emit(CharacterOffline.event, new CharacterOffline(id));
    }

    allCharactersOffline(data: CharacterOffline[]) {
        this.client.emit(AllCharactersOffline.event, new AllCharactersOffline(data));
    }

    async getCharacterName(id: number) {
        return await this.client.send(GetCharacterName.event, new GetCharacterName(id)).pipe(first()).toPromise();
    }

    async getCharacter(id: number): Promise<Character> {
        return await this.client.send(GetCharacter.event, new GetCharacter(id)).pipe(first()).toPromise();
    }

}
