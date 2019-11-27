import {Injectable}  from "@nestjs/common";
import {ClientProxy} from "@nestjs/microservices";
import {first}       from "rxjs/operators";
import {Character}   from "../entities/character";
import {
    AllCharactersOffline,
    CharacterCreate,
    CharacterGetAll,
    CharacterOffline,
    CharacterOnline, GetCharacterName
}                    from "../actions";

@Injectable()
export class CharacterClient {

    constructor(private client: ClientProxy) {

    }

    async create(accountId: number, world: string, name: string, gender: 'male' | 'female'): Promise<Character> {
        return await this.client.send(CharacterCreate.event, new CharacterCreate(accountId, world, name, gender)).pipe(first()).toPromise();
    }

    async getAll(accountId: number, world: string) {
        return await this.client.send(CharacterGetAll.event, new CharacterGetAll(accountId, world)).pipe(first()).toPromise();
    }

    characterOnline(characterId: number) {
        this.client.emit(CharacterOnline.event, new CharacterOnline(characterId));
    }

    characterOffline(characterId) {
        this.client.emit(CharacterOffline.event, new CharacterOffline(characterId));
    }

    allCharactersOffline(data: CharacterOffline[]) {
        this.client.emit(AllCharactersOffline.event, new AllCharactersOffline(data));
    }

    async getCharacterName(characterId: number) {
        return await this.client.send(GetCharacterName.event, new GetCharacterName(characterId)).pipe(first()).toPromise();
    }

}
