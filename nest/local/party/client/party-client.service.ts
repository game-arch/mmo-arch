import { Inject, Injectable }                                    from '@nestjs/common'
import { ClientProxy }                                           from '@nestjs/microservices'
import { CreateParty, GetParty, InviteToParty, MakePartyLeader } from '../../../../shared/actions/party.actions'
import { first }                                                 from 'rxjs/operators'
import { Party }      from '../entities/party'
import { WorldEvent } from '../../../lib/event.types'

@Injectable()
export class PartyClient {

    constructor(
        @Inject('PARTY_CLIENT') private client: ClientProxy
    ) {

    }

    async getPartyByLeader(leaderId: number): Promise<Party> {
        return await this.client.send(
            new WorldEvent(GetParty.type),
            new GetParty(leaderId)
        ).pipe(first()).toPromise()
    }

    async createParty(partyName: string, characterId: number): Promise<Party> {
        return await this.client.send(
            new WorldEvent(CreateParty.type),
            new CreateParty(partyName, characterId)
        ).pipe(first()).toPromise()
    }

    async makeLeader(leaderId: number, characterId: number): Promise<boolean> {
        return await this.client.send(
            new WorldEvent(MakePartyLeader.type),
            new MakePartyLeader(leaderId, characterId)
        ).pipe(first()).toPromise()
    }

    async inviteToParty(leaderId: number, characterId: number): Promise<boolean> {
        return await this.client.send(
            new WorldEvent(InviteToParty.type),
            new InviteToParty(leaderId, characterId)
        ).pipe(first()).toPromise()
    }
}
