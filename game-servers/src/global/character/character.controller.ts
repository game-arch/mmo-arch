import {Controller, Get}              from '@nestjs/common';
import {CharacterService}             from './character.service';
import {EventPattern, MessagePattern} from "@nestjs/microservices";
import {
    AllCharactersOffline,
    CharacterCreate,
    GetCharacters,
    CharacterOffline,
    CharacterOnline, GetCharacter, GetCharacterName
}                                     from "./actions";

@Controller()
export class CharacterController {

    constructor(private service: CharacterService) {

    }

    @MessagePattern(GetCharacters.event)
    async getCharacters(data: GetCharacters) {
        return await this.service.getCharactersFor(data.accountId, data.world);
    }

    @MessagePattern(GetCharacter.event)
    async getCharacter(data: GetCharacter) {
        return await this.service.getCharacter(data.characterId);
    }

    @MessagePattern(CharacterCreate.event)
    async createCharacter(data: CharacterCreate) {
        return await this.service.createCharacterFor(data.accountId, data.world, data.name, data.gender);
    }

    @EventPattern(CharacterOnline.event)
    async characterOnline(data: CharacterOnline) {
        await this.service.characterOnline(data);
    }

    @EventPattern(CharacterOffline.event)
    async characterOffline(data: CharacterOffline) {
        await this.service.characterOffline(data);
    }

    @EventPattern(AllCharactersOffline.event)
    async allCharactersOffline(data: AllCharactersOffline) {
        await this.service.allCharactersOffline(data);
    }

    @MessagePattern(GetCharacterName.event)
    async getCharacterName(data: GetCharacterName) {
        return await this.service.getCharacterName(data.characterId);
    }

}
