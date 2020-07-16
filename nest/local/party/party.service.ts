import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository }                                            from '@nestjs/typeorm'
import { RpcException }                                                from '@nestjs/microservices'
import { Party }                                                       from './entities/party'
import { Repository }                                                  from 'typeorm'
import { PartyEmitter }      from './party.emitter'
import { PartyLeaderOnline } from '../../../shared/actions/party.actions'
import { CharacterClient }   from '../character/client/character.client'

@Injectable()
export class PartyService {
    constructor(
        private emitter: PartyEmitter,
        @InjectRepository(Party)
        private repo: Repository<Party>,
        private character: CharacterClient
    ) {
    }


    async getPartyByLeader(leaderId: number) {
        return this.repo.findOne({ leader: leaderId })
    }

    async createParty(name: string, characterId: number) {
        let party: Party = await this.repo.findOne({ name })
        if (party) {
            throw new RpcException(
                new ConflictException('Party Name Already Taken')
            )
        }
        try {
            party         = this.repo.create()
            party.name    = name
            party.leader  = characterId
            party.members = []
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

    async makeLeader(leaderId: number, characterId: number) {
        const party     = await this.repo.findOne({ leader: leaderId })
        const character = await this.character.getCharacter(characterId)
        if (party.members.includes(characterId) && character.status === 'online') {
            party.leader = characterId
            await this.repo.save(party)
            this.emitter.madePartyLeader(party.id, party.leader)
            return true
        }
        return false
    }

    async pickLeader(party: Party): Promise<number> {
        // get the first member in party that is online
        for (const member of party.members) {
            const character = await this.character.getCharacter(member)
            if (character.status === 'online') {
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
        return this.isLeader(data.leaderId, party)
    }

    isLeader(characterId: number, party: Party): boolean {
        return party.leader === characterId
    }

    isPartyFull(party: Party): boolean {
        return party.members.length > 4
    }

    async isInvited(party: Party, characterId: number): Promise<boolean> {
        return party.invitees.includes(characterId)
    }
}
