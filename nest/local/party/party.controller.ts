import { Controller }                             from '@nestjs/common'
import { PartyService }                           from './party.service'
import { MessagePattern }                         from '@nestjs/microservices'
import { CreateParty, GetParty, MakePartyLeader } from '../../../shared/actions/party.actions'
import { WorldEvent }                             from '../../lib/event.types'

@Controller()
export class PartyController {
    constructor(private service: PartyService) {
    }

    @MessagePattern(new WorldEvent(GetParty.type))
    getParty(data: GetParty) {
        return this.service.getPartyByLeader(data.leaderId)
    }

    @MessagePattern(new WorldEvent(CreateParty.type))
    createParty(data: CreateParty) {
        return this.service.createParty(data.partyName, data.characterId)
    }

    @MessagePattern(new WorldEvent(MakePartyLeader.type))
    makeLeader(data: MakePartyLeader) {
        return this.service.makeLeader(data.leaderId, data.characterId)
    }

}
