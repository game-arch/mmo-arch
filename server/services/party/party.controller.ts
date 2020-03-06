import { Controller }            from "@nestjs/common";
import { PartyService }          from "./party.service";
import { MessagePattern }        from "@nestjs/microservices";
import { WORLD_PREFIX }          from "../world/world.prefix";
import { CreateParty, GetParty } from "./actions";

@Controller()
export class PartyController {
  constructor(private service: PartyService) {
  }

  @MessagePattern(WORLD_PREFIX + GetParty.event)
  getParty(data: GetParty) {
    return this.service.getPartyName(data.partyId);
  }

  @MessagePattern(WORLD_PREFIX + CreateParty.event)
  createParty(data: CreateParty) {
    return this.service.createParty(data.name, data.characterName);
  }
}
