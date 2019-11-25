import {Controller, Get}                                         from '@nestjs/common';
import {CharacterService}                                        from './character.service';
import {EventPattern, MessagePattern}                            from "@nestjs/microservices";
import {CharacterEvents}                                         from "./character.events";
import {AllCharactersOffline, CharacterOffline, CharacterOnline} from "../../../lib/actions";

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
