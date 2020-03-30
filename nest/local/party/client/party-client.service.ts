import { Inject, Injectable }                                    from '@nestjs/common'
import { ClientProxy }                                           from '@nestjs/microservices'
import { WORLD_PREFIX }                                          from '../../world/world.prefix'
import { CreateParty, GetParty, InviteToParty, MakePartyLeader } from '../../../../shared/events/party.events'
import { first }                                                 from 'rxjs/operators'
import { Party }                                                 from '../entities/party'

@Injectable()
export class PartyClient {

    constructor(
        @Inject('PARTY_CLIENT') private client: ClientProxy
    ) {

    }

    async getPartyByLeader(leaderId: number): Promise<Party> {
        return await this.client.send(
            WORLD_PREFIX + GetParty.event,
            new GetParty(leaderId)
        ).pipe(first()).toPromise()
    }

    async createParty(partyName: string, characterId: number): Promise<Party> {
        return await this.client.send(
            WORLD_PREFIX + CreateParty.event,
            new CreateParty(partyName, characterId)
        ).pipe(first()).toPromise()
    }

    async makeLeader(leaderId: number, characterId: number): Promise<boolean> {
        return await this.client.send(
            WORLD_PREFIX + MakePartyLeader.event,
            new MakePartyLeader(leaderId, characterId)
        ).pipe(first()).toPromise()
    }

    async inviteToParty(leaderId: number, characterId: number): Promise<boolean> {
        return await this.client.send(
            WORLD_PREFIX + InviteToParty.event,
            new InviteToParty(leaderId, characterId)
        ).pipe(first()).toPromise()
    }
}
