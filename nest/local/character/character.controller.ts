import { Controller }       from '@nestjs/common'
import { CharacterService } from './character.service'
import { MessagePattern }   from '@nestjs/microservices'
import {
    AllCharactersOffline,
    CharacterOffline,
    CharacterOnline,
    CreateCharacter,
    GetCharacter,
    GetCharacterName,
    GetCharacters
}                     from '../../../shared/events/character.events'
import { WorldEvent } from '../world/event.types'

@Controller()
export class CharacterController {

    constructor(private service: CharacterService) {

    }

    @MessagePattern(new WorldEvent(GetCharacters.event))
    getCharacters(data: GetCharacters) {
        return this.service.getCharactersFor(data.accountId, data.world)
    }

    @MessagePattern(new WorldEvent(GetCharacter.event))
    getCharacter(data: GetCharacter) {
        return this.service.getCharacter(data.characterId)
    }

    @MessagePattern(new WorldEvent(CreateCharacter.event))
    createCharacter(data: CreateCharacter) {
        return this.service.createCharacterFor(data.accountId, data.world, data.name, data.gender)
    }

    @MessagePattern(new WorldEvent(CharacterOnline.event))
    characterOnline(data: CharacterOnline) {
        return this.service.characterOnline(data)
    }

    @MessagePattern(new WorldEvent(CharacterOffline.event))
    characterOffline(data: CharacterOffline) {
        return this.service.characterOffline(data)
    }

    @MessagePattern(new WorldEvent(AllCharactersOffline.event))
    allCharactersOffline(data: AllCharactersOffline) {
        return this.service.allCharactersOffline(data)
    }

    @MessagePattern(new WorldEvent(GetCharacterName.event))
    getCharacterName(data: GetCharacterName) {
        return this.service.getCharacterName(data.characterId)
    }

}
