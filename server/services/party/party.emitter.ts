import { ClientProxy }  from "@nestjs/microservices";
import {
  Inject,
  Injectable
}                       from "@nestjs/common";
import {
  GetPartyInvite,
  MakePartyLeader,
  PartyCreated,
  PartyMemberJoined,
  PartyMemberKicked,
  PartyMemberLeft
}                       from "./actions";
import { WORLD_PREFIX } from "../world/world.prefix";

@Injectable()
export class PartyEmitter {
  constructor(@Inject("WORLD_CLIENT") protected client: ClientProxy) {
  }

  createParty(characterId: number, world: string) {
    this.client.emit(
      WORLD_PREFIX + PartyCreated.event,
      new PartyCreated(world, characterId)
    );
  }

  inviteToParty(leaderName: string) {
    this.client.emit(
      WORLD_PREFIX + GetPartyInvite.event,
      new GetPartyInvite(leaderName)
    );
  }

  joinParty(characterId: number, characterName: string, partyId: number) {
    this.client.emit(
      WORLD_PREFIX + PartyMemberJoined.event,
      new PartyMemberJoined(characterId, characterName, partyId)
    );
  }

  leaveParty(characterId: number, characterName: string, partyId: number) {
    this.client.emit(
      WORLD_PREFIX + PartyMemberLeft.event,
      new PartyMemberLeft(characterId, characterName, partyId)
    );
  }

  makeLeader(characterName: string) {
    this.client.emit(
      WORLD_PREFIX + MakePartyLeader.event,
      new MakePartyLeader(characterName)
    );
  }

  kickFromParty(characterId: number, partyId: number) {
    this.client.emit(
      WORLD_PREFIX + PartyMemberKicked.event,
      new PartyMemberKicked(characterId, partyId)
    );
  }
}
