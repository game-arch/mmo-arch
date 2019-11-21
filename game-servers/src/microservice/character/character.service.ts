import {ConflictException, Injectable, InternalServerErrorException} from '@nestjs/common';
import {InjectRepository}                                            from "@nestjs/typeorm";
import {Character}                                                   from "./entities/character";
import {QueryFailedError, Repository}                                from "typeorm";
import {RpcException}                                                from "@nestjs/microservices";

@Injectable()
export class CharacterService {
    constructor(
        @InjectRepository(Character)
        private repo: Repository<Character>) {

    }

    getHello(): string {
        return 'Hello World!';
    }

    async getCharactersByAccountId(accountId: number) {
        return await this.repo.find({accountId});
    }

    async createCharacterFor(accountId: number, name: string, gender: 'male' | 'female') {
        try {
            let character       = this.repo.create();
            character.name      = name;
            character.accountId = accountId;
            character.gender    = gender;
            await this.repo.save(character);
            return character;
        } catch (e) {
            if (e.message.indexOf('_DUP_') !== -1) {
                throw new RpcException(new ConflictException("Character Name Already Taken"));
            }
            throw new RpcException(new InternalServerErrorException(e.message));
        }
    }
}
