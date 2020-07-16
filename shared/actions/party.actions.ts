export class CreateParty {
    static readonly type = '[Party] Create'

    constructor(public partyName: string, public characterId: number) {
    }
}

export class PartyCreated {
    static readonly type = '[Party] Created'

    constructor(public partyId: number, public characterId: number) {
    }
}

export class PartyNotCreated {
    static readonly type = '[Party] Not Created'

    constructor(
        public error: {
            statusCode: number
        }
    ) {
    }
}

export class GetParty {
    static readonly type = '[Party] Get Party'

    constructor(public leaderId: number) {
    }
}

export class GetPartyMembers {
    static readonly type = '[Party] Get All Members'

    constructor(public leaderId: number) {
    }
}

export class MakePartyLeader {
    static readonly type = '[Party] Make Leader'

    constructor(public leaderId: number, public characterId: number) {
    }
}

export class MadePartyLeader {
    static readonly type = '[Party] Made Leader'

    constructor(public partyId: number, public characterId: number) {
    }
}

export class PartyLeaderNotChanged {
    static readonly type = '[Party] Leader Not Changed'
}

export class GetPartyLeader {
    static readonly type = '[Party] Get Leader'

    constructor(public partyId: number) {
    }
}

export class PartyLeaderOnline {
    static readonly type = '[Party] Leader Came Online'

    constructor(public leaderId: number, public partyName: string) {
    }
}

export class PartyMemberJoined {
    static readonly type = '[Party] Member Joined'

    constructor(
        public characterId: number,
        public partyName: string,
        public partyId: number
    ) {
    }
}

export class InviteToParty {
    static readonly type = '[Party] Invite'

    constructor(public leaderId: number, public characterId: number) {
    }
}

export class InvitedToParty {
    static readonly type = '[Party] Invited'

    constructor(public partyId: number, public leaderId: number, public characterId: number) {
    }
}

export class PartyMemberLeft {
    static readonly type = '[Party] Member Left'

    constructor(
        public characterId: number,
        public partyName: string,
        public partyId: number
    ) {
    }
}

export class PartyMemberKicked {
    static readonly type = '[Party] Member Kicked'

    constructor(public partyId: number, public characterId: number) {
    }
}
