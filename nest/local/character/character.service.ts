import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository }                                            from '@nestjs/typeorm'
import { Character }                                                   from './entities/character'
import { Repository }                                                  from 'typeorm'
import { RpcException }                                            from '@nestjs/microservices'
import { AllCharactersOffline, CharacterOffline, CharacterOnline } from '../../../shared/actions/character.actions'
import { CharacterEmitter }                                        from './character.emitter'

@Injectable()
export class CharacterService {
    constructor(
        private emitter: CharacterEmitter,
        @InjectRepository(Character)
        private repo: Repository<Character>) {

    }

    async getCharactersFor(accountId: number, world: string) {
        return (await this.repo.find({ accountId, world }))
    }

    async getCharacter(characterId: number) {
        return (await this.repo.findOne(characterId))
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
            await this.repo.save(character)
            return character
        } catch (e) {
            console.log(e)
            if (e.message.indexOf('UNIQUE') !== -1) {
                throw new RpcException(new ConflictException('Character Name Already Taken'))
            }
            throw new RpcException(new InternalServerErrorException(e.message))
        }
    }


    async characterOnline(data: CharacterOnline) {
        const character = await this.repo.findOne(data.characterId)
        if (character) {
            character.status   = 'online'
            character.socketId = data.socketId
            await this.repo.save(character)
            this.emitter.characterLoggedIn(character.id, character.gender, character.world, character.name)
        }
    }

    async characterOffline(data: CharacterOffline) {
        const character = await this.repo.findOne(data.characterId)
        if (character) {
            character.status = 'offline'
            await this.repo.save(character)
            this.emitter.characterLoggedOut(character.id, character.name, character.world)
        }
    }

    async allCharactersOffline(data: AllCharactersOffline) {
        for (const character of data.characters) {
            await this.characterOffline(character)
        }
    }
}
