import { Controller }      from '@nestjs/common'
import { PartyGateway }    from './party.gateway'
import { EventPattern }    from '@nestjs/microservices'
import { MadePartyLeader } from '../../../../shared/actions/party.actions'
import { PartyClient } from '../../party/client/party-client.service'
import { WorldEvent }  from '../../../lib/event.types'

@Controller()
export class PartyController {

    constructor(
        private gateway: PartyGateway,
        private client: PartyClient
    ) {

    }

    @EventPattern(new WorldEvent(MadePartyLeader.type))
    async onMadePartyLeader(data: MadePartyLeader) {
        const party = await this.client.getPartyByLeader(data.characterId)
        if (party) {
            this.gateway.server.to('party.' + party.name).emit(MadePartyLeader.type, data)
        }
    }
}
