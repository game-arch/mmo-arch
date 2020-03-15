import { ClientProxy }        from '@nestjs/microservices'
import { Inject, Injectable } from '@nestjs/common'
import { MadePartyLeader }    from './actions'
import { WORLD_PREFIX }       from '../world/world.prefix'

@Injectable()
export class PartyEmitter {
    constructor(@Inject('LOCAL_CLIENT') protected client: ClientProxy) {
    }

    madePartyLeader(partyId: number, characterId: number) {
        this.client.emit(
            WORLD_PREFIX + MadePartyLeader.event,
            new MadePartyLeader(partyId, characterId)
        )
    }
}
