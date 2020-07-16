import { Controller }       from '@nestjs/common'
import { CharacterService } from './character.service'
import { MessagePattern } from '@nestjs/microservices'
import {
    AllCharactersOffline,
    CharacterOffline,
    CharacterOnline,
    CreateCharacter,
    GetCharacter,
    GetCharacterName,
    GetCharacters
}                     from '../../../shared/actions/character.actions'
import { WorldEvent } from '../../lib/event.types'

@Controller()
export class CharacterController {

    constructor(private service: CharacterService) {

    }

    @MessagePattern(new WorldEvent(GetCharacters.type))
    getCharacters(data: GetCharacters) {
        return this.service.getCharactersFor(data.accountId, data.world)
    }

    @MessagePattern(new WorldEvent(GetCharacter.type))
    getCharacter(data: GetCharacter) {
        return this.service.getCharacter(data.characterId)
    }

    @MessagePattern(new WorldEvent(CreateCharacter.type))
    createCharacter(data: CreateCharacter) {
        return this.service.createCharacterFor(data.accountId, data.world, data.name, data.gender)
    }

    @MessagePattern(new WorldEvent(CharacterOnline.type))
    characterOnline(data: CharacterOnline) {
        return this.service.characterOnline(data)
    }

    @MessagePattern(new WorldEvent(CharacterOffline.type))
    characterOffline(data: CharacterOffline) {
        return this.service.characterOffline(data)
    }

    @MessagePattern(new WorldEvent(AllCharactersOffline.type))
    allCharactersOffline(data: AllCharactersOffline) {
        return this.service.allCharactersOffline(data)
    }

    @MessagePattern(new WorldEvent(GetCharacterName.type))
    getCharacterName(data: GetCharacterName) {
        return this.service.getCharacterName(data.characterId)
    }

}
