import {Controller, Get}  from '@nestjs/common';
import {CharacterService} from './character.service';
import {MessagePattern}   from "@nestjs/microservices";
import {CharacterEvents}  from "./character.events";

@Controller()
export class CharacterController {

    constructor(private service: CharacterService) {

    }

    @MessagePattern(CharacterEvents.GET_ALL)
    async getCharacters(data: { accountId: number }) {
        return await this.service.getCharactersByAccountId(data.accountId);
    }

    @MessagePattern(CharacterEvents.CREATE)
    async createCharacter(data: { accountId: number, name: string, gender: 'male' | 'female' }) {
        return await this.service.createCharacterFor(data.accountId, data.name, data.gender);
    }

}
