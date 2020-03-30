import { ClientProxy }        from '@nestjs/microservices'
import { Inject, Injectable } from '@nestjs/common'
import { MadePartyLeader }    from '../../../shared/events/party.events'
import { WORLD_PREFIX }       from '../world/world.prefix'
import { LOCAL_CLIENT }       from '../../client/client.module'

@Injectable()
export class PartyEmitter {
    constructor(@Inject(LOCAL_CLIENT) protected client: ClientProxy) {
    }

    madePartyLeader(partyId: number, characterId: number) {
        this.client.emit(
            WORLD_PREFIX + MadePartyLeader.event,
            new MadePartyLeader(partyId, characterId)
        )
    }
}
