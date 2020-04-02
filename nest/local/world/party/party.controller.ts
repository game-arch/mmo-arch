import { Controller }      from '@nestjs/common'
import { PartyGateway }    from './party.gateway'
import { EventPattern }    from '@nestjs/microservices'
import { MadePartyLeader } from '../../../../shared/events/party.events'
import { PartyClient } from '../../party/client/party-client.service'
import { WorldEvent }  from '../event.types'

@Controller()
export class PartyController {

    constructor(
        private gateway: PartyGateway,
        private client: PartyClient
    ) {

    }

    @EventPattern(new WorldEvent(MadePartyLeader.event))
    async onMadePartyLeader(data: MadePartyLeader) {
        const party = await this.client.getPartyByLeader(data.characterId)
        if (party) {
            this.gateway.server.to('party.' + party.name).emit(MadePartyLeader.event, data)
        }
    }
}
