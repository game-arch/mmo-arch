import { Controller }                             from "@nestjs/common";
import { PartyService }                           from "./party.service";
import { MessagePattern }                         from "@nestjs/microservices";
import { WORLD_PREFIX }                           from "../world/world.prefix";
import { CreateParty, GetParty, MakePartyLeader } from "./actions";

@Controller()
export class PartyController {
    constructor(private service: PartyService) {
    }

    @MessagePattern(WORLD_PREFIX + GetParty.event)
    getParty(data: GetParty) {
        return this.service.getPartyByLeader(data.leaderId);
    }

    @MessagePattern(WORLD_PREFIX + CreateParty.event)
    createParty(data: CreateParty) {
        return this.service.createParty(data.partyName, data.characterId);
    }

    @MessagePattern(WORLD_PREFIX + MakePartyLeader.event)
    makeLeader(data: MakePartyLeader) {
        return this.service.makeLeader(data.leaderId, data.characterId);
    }

}
