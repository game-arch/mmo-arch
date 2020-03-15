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
}                           from './actions'
import { WORLD_PREFIX }     from '../world/world.prefix'

@Controller()
export class CharacterController {

    constructor(private service: CharacterService) {

    }

    @MessagePattern(WORLD_PREFIX + GetCharacters.event)
    getCharacters(data: GetCharacters) {
        return this.service.getCharactersFor(data.accountId, data.world)
    }

    @MessagePattern(WORLD_PREFIX + GetCharacter.event)
    getCharacter(data: GetCharacter) {
        return this.service.getCharacter(data.characterId)
    }

    @MessagePattern(WORLD_PREFIX + CreateCharacter.event)
    createCharacter(data: CreateCharacter) {
        return this.service.createCharacterFor(data.accountId, data.world, data.name, data.gender)
    }

    @MessagePattern(WORLD_PREFIX + CharacterOnline.event)
    characterOnline(data: CharacterOnline) {
        console.log('character online')
        return this.service.characterOnline(data)
    }

    @MessagePattern(WORLD_PREFIX + CharacterOffline.event)
    characterOffline(data: CharacterOffline) {
        return this.service.characterOffline(data)
    }

    @MessagePattern(WORLD_PREFIX + AllCharactersOffline.event)
    allCharactersOffline(data: AllCharactersOffline) {
        return this.service.allCharactersOffline(data)
    }

    @MessagePattern(WORLD_PREFIX + GetCharacterName.event)
    getCharacterName(data: GetCharacterName) {
        return this.service.getCharacterName(data.characterId)
    }

}
