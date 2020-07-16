import { ClientProxy }        from '@nestjs/microservices'
import { Inject, Injectable } from '@nestjs/common'
import { MadePartyLeader }    from '../../../shared/actions/party.actions'
import { LOCAL_CLIENT } from '../../client/client.module'
import { WorldEvent }   from '../../lib/event.types'

@Injectable()
export class PartyEmitter {
    constructor(@Inject(LOCAL_CLIENT) protected client: ClientProxy) {
    }

    madePartyLeader(partyId: number, characterId: number) {
        this.client.emit(
            new WorldEvent(MadePartyLeader.type),
            new MadePartyLeader(partyId, characterId)
        )
    }
}
