export class CreateParty {
  static readonly event = "party.create";

  constructor(public name: string, public characterName: string) {
  }
}

export class PartyCreated {
  static readonly event = "party.created";

  constructor(public world: string, public characterId: number) {
  }
}

export class PartyNotCreated {
  static readonly event = "party.not_created";

  constructor(
    public error: {
      statusCode: number
    }
  ) {
  }
}

export class GetParty {
  static readonly event = "party.get_party";

  constructor(public partyId: number) {
  }
}

export class GetPartyMembers {
  static readonly event = "party.get_all_members";

  constructor(public accountId: number, public world: string) {
  }
}

export class MakePartyLeader {
  static readonly event = "party.make_leader";

  constructor(public characterName: string) {
  }
}

export class GetPartyLeader {
  static readonly event = "party.get_leader";

  constructor(public characterId: number) {
  }
}

export class PartyLeaderOnline {
  static readonly event = "party.online_leader";

  constructor(public characterId: number, public socketId: string) {
  }
}

export class PartyMemberJoined {
  static readonly event = "party.member_joined";

  constructor(
    public characterId: number,
    public name: string,
    public partyId: number
  ) {
  }
}

export class GetPartyInvite {
  static readonly event = "party.get_invite";

  constructor(public leaderName: string) {
  }
}

export class PartyMemberLeft {
  static readonly event = "party.member_left";

  constructor(
    public characterId: number,
    public name: string,
    public partyId: number
  ) {
  }
}

export class PartyMemberOffline {
  static readonly event = "party.member_offline";

  constructor(public characterId: number) {
  }
}

export class PartyMemberKicked {
  static readonly event = "party.member_kicked";

  constructor(public characterId: number, public partyId: number) {
  }
}
