import { Controller }                             from '@nestjs/common'
import { PartyService }                           from './party.service'
import { MessagePattern }                         from '@nestjs/microservices'
import { CreateParty, GetParty, MakePartyLeader } from '../../../shared/events/party.events'
import { WorldEvent }                             from '../world/event.types'

@Controller()
export class PartyController {
    constructor(private service: PartyService) {
    }

    @MessagePattern(new WorldEvent(GetParty.event))
    getParty(data: GetParty) {
        return this.service.getPartyByLeader(data.leaderId)
    }

    @MessagePattern(new WorldEvent(CreateParty.event))
    createParty(data: CreateParty) {
        return this.service.createParty(data.partyName, data.characterId)
    }

    @MessagePattern(new WorldEvent(MakePartyLeader.event))
    makeLeader(data: MakePartyLeader) {
        return this.service.makeLeader(data.leaderId, data.characterId)
    }

}
