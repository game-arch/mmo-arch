import {Controller, Get}  from '@nestjs/common';
import {CharacterService} from './character.service';
import {MessagePattern}   from "@nestjs/microservices";
import {
    AllCharactersOffline,
    CreateCharacter,
    GetCharacters,
    CharacterOffline,
    CharacterOnline, GetCharacter, GetCharacterName
}                         from "./actions";

@Controller()
export class CharacterController {

    constructor(private service: CharacterService) {

    }

    @MessagePattern(GetCharacters.event)
    getCharacters(data: GetCharacters) {
        return this.service.getCharactersFor(data.accountId, data.world);
    }

    @MessagePattern(GetCharacter.event)
    getCharacter(data: GetCharacter) {
        return this.service.getCharacter(data.characterId);
    }

    @MessagePattern(CreateCharacter.event)
    createCharacter(data: CreateCharacter) {
        return this.service.createCharacterFor(data.accountId, data.world, data.name, data.gender);
    }

    @MessagePattern(CharacterOnline.event)
    characterOnline(data: CharacterOnline) {
        return this.service.characterOnline(data);
    }

    @MessagePattern(CharacterOffline.event)
    characterOffline(data: CharacterOffline) {
        return this.service.characterOffline(data);
    }

    @MessagePattern(AllCharactersOffline.event)
    allCharactersOffline(data: AllCharactersOffline) {
        return this.service.allCharactersOffline(data);
    }

    @MessagePattern(GetCharacterName.event)
    getCharacterName(data: GetCharacterName) {
        return this.service.getCharacterName(data.characterId);
    }

}
