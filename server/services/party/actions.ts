export class CreateParty {
    static readonly event = 'party.create'

    constructor(public partyName: string, public characterId: number) {
    }
}

export class PartyCreated {
    static readonly event = 'party.created'

    constructor(public partyId:number, public characterId: number) {
    }
}

export class PartyNotCreated {
    static readonly event = 'party.not_created'

    constructor(
        public error: {
            statusCode: number
        }
    ) {
    }
}

export class GetParty {
    static readonly event = 'party.get_party'

    constructor(public leaderId: number) {
    }
}

export class GetPartyMembers {
    static readonly event = 'party.get_all_members'

    constructor(public characterName: string) {
    }
}

export class MakePartyLeader {
    static readonly event = 'party.make_leader'

    constructor(public leaderId: number, public characterId: number) {
    }
}
export class MadePartyLeader {
    static readonly event = 'party.made_party_leader'

    constructor(public partyId: number, public characterId: number) {
    }
}

export class PartyLeaderNotChanged {
    static readonly event = 'party.leader_not_changed'
}

export class GetPartyLeader {
    static readonly event = 'party.get_leader'

    constructor(public partyName: string) {
    }
}

export class PartyLeaderOnline {
    static readonly event = 'party.online_leader'

    constructor(public leaderId: number, public partyName: string) {
    }
}

export class PartyMemberJoined {
    static readonly event = 'party.member_joined'

    constructor(
        public characterId: number,
        public partyName: string,
        public partyId: number
    ) {
    }
}

export class InviteToParty {
    static readonly event = 'party.invite_to_party'

    constructor(public leaderId: number, public characterId: number) {
    }
}

export class InvitedToParty {
    static readonly event = 'party.invited_to_party'

    constructor(public partyId: number, public leaderId: number, public characterId: number) {
    }
}

export class PartyMemberLeft {
    static readonly event = 'party.member_left'

    constructor(
        public characterId: number,
        public partyName: string,
        public partyId: number
    ) {
    }
}

export class PartyMemberOnline {
    static readonly event = 'party.member_online'

    constructor(public partyId:number, public characterId: number) {
    }
}
export class PartyMemberOffline {
    static readonly event = 'party.member_offline'

    constructor(public partyId:number, public characterId: number) {
    }
}

export class PartyMemberKicked {
    static readonly event = 'party.member_kicked'

    constructor(public partyId: number, public characterId: number) {
    }
}
