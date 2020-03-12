import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository }                                            from '@nestjs/typeorm'
import { Character }                                                   from './entities/character'
import { Repository }                                              from 'typeorm'
import { RpcException }                                            from '@nestjs/microservices'
import { AllCharactersOffline, CharacterOffline, CharacterOnline } from './actions'
import { CharacterEmitter }                                        from './character.emitter'
import { CharacterStats }                                          from './entities/character-stats'
import { EquipmentSet }                                            from '../item/entities/equipment-set'
import { CharacterParameters }                                     from './entities/character-parameters'

@Injectable()
export class CharacterService {
    constructor(
        private emitter: CharacterEmitter,
        @InjectRepository(Character)
        private repo: Repository<Character>) {

    }

    async getCharactersFor(accountId: number, world: string) {
        return (await this.repo.find({ accountId, world })).map(character => character.toJSON())
    }

    async getCharacter(characterId: number) {
        return (await this.repo.findOne(characterId, { relations: ['stats', 'parameters'] })).toJSON()
    }

    async getCharacterName(characterId: number) {
        return (await this.getCharacter(characterId)).name
    }

    async createCharacterFor(accountId: number, world: string, name: string, gender: 'male' | 'female') {
        let character = await this.repo.findOne({ name, world })
        if (character) {
            throw new RpcException(new ConflictException('Character Name Already Taken'))
        }
        try {
            character           = this.repo.create()
            character.name      = name
            character.world     = world
            character.accountId = accountId
            character.gender    = gender
            this.newCharacterStats(character)
            this.newCharacterParameters(character)
            await this.repo.save(character)
            return character.toJSON()
        } catch (e) {
            console.log(e)
            if (e.message.indexOf('UNIQUE') !== -1) {
                throw new RpcException(new ConflictException('Character Name Already Taken'))
            }
            throw new RpcException(new InternalServerErrorException(e.message))
        }
    }


    async characterOnline(data: CharacterOnline) {
        let character = await this.repo.findOne({ id: data.characterId }, { relations: ['stats', 'parameters'] })
        if (character) {
            character.status   = 'online'
            character.socketId = data.socketId
            if (!character.stats) {
                this.newCharacterStats(character)
            }
            if (!character.parameters) {
                this.newCharacterParameters(character)
            }
            await this.repo.save(character)
            this.emitter.characterLoggedIn(character.id, character.gender, character.world, character.name)
            this.emitter.characterDetails(character)
        }
    }

    async characterDetails(characterId: number) {
        let character = await this.repo.findOne({ id: characterId })
        if (character) {
            return character.toJSON()
        }
        return null
    }

    async characterOffline(data: CharacterOffline) {
        let character = await this.repo.findOne({ id: data.characterId })
        if (character) {
            character.status = 'offline'
            await this.repo.save(character)
            this.emitter.characterLoggedOut(character.id, character.name, character.world)
        }
    }

    async allCharactersOffline(data: AllCharactersOffline) {
        for (let character of data.characters) {
            await this.characterOffline(character)
        }
    }

    private newCharacterStats(character) {
        character.stats           = new CharacterStats()
        character.stats.character = character
    }

    private newCharacterParameters(character) {
        character.parameters           = new CharacterParameters()
        character.parameters.character = character
    }
}
