import {Controller, Get}              from '@nestjs/common';
import {CharacterService}             from './character.service';
import {EventPattern, MessagePattern} from "@nestjs/microservices";
import {
    AllCharactersOffline,
    CharacterCreate,
    CharacterGetAll,
    CharacterOffline,
    CharacterOnline
}                                     from "./actions";

@Controller()
export class CharacterController {

    constructor(private service: CharacterService) {

    }

    @MessagePattern(CharacterGetAll.event)
    async getCharacters(data: CharacterGetAll) {
        return await this.service.getCharactersFor(data.accountId, data.world);
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
        console.log(data);
        await this.service.allCharactersOffline(data);
    }

}
