import {
    Injectable,
    ConflictException,
    InternalServerErrorException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { RpcException } from '@nestjs/microservices'
import { Party } from './entities/party'
import { Repository } from 'typeorm'
import { PartyEmitter } from './party.emitter'
import { PartyLeaderOnline } from './actions'

@Injectable()
export class PartyService {
    constructor(
        private emitter: PartyEmitter,
        @InjectRepository(Party)
        private repo: Repository<Party>
    ) {}

    async getPartyName(partyId: number) {
        return this.repo.findOne(partyId)
    }

    async createParty(name: string, characterName: string) {
        let party: Party = await this.repo.findOne({ name })
        if (party) {
            throw new RpcException(
                new ConflictException('Party Name Already Taken')
            )
        }
        try {
            party = this.repo.create()
            party.name = name
            party.leader = characterName
            party.members = new Set([])
            await this.repo.save(party)
            return party
        } catch (e) {
            console.log(e)
            if (e.message.indexOf('UNIQUE') !== -1) {
                throw new RpcException(
                    new ConflictException('Character Name Already Taken')
                )
            }
            throw new RpcException(new InternalServerErrorException(e.message))
        }
    }

    async pickLeader(data: PartyLeaderOnline, party: Party): Promise<string> {
        // get the first member in party that is online
        for (let member of party.members) {
            let character = await this.repo.findOne({ id: data.characterId })
            if (character) {
                return member
            }
        }
        // no one is online - pick the first one
        return party.members.values().next().value
    }

    async isPartyLeader(
        data: PartyLeaderOnline,
        party: Party
    ): Promise<boolean> {
        const character = await this.repo.findOne({ id: data.characterId })
        return this.isLeader(character.name, party)
    }

    isLeader(name: string, party: Party): boolean {
        return party.leader === name
    }

    isPartyFull(party: Party): boolean {
        return party.members.size + 1 >= 5
    }

    async isInvited(party: Party, data: PartyLeaderOnline): Promise<boolean> {
        const character = await this.repo.findOne({ id: data.characterId })
        return party.invitees.has(character.name)
    }
}
