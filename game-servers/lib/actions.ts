export class PresenceOnline {
    static readonly event = 'presence.online';

    constructor() {

    }
}

export class GetServers {
    static readonly event = 'presence.server_list';
}

export class RegisterServer {
    static readonly event = 'presence.register_server';

    constructor(
        public host: string,
        public port: number,
        public constant: string,
        public name: string,
        public instanceId: number
    ) {

    }
}

export class ServerOffline {
    static readonly event = 'presence.server_offline';

    constructor(
        public serverId: number
    ) {

    }
}

export class UserConnected {
    static readonly event = 'presence.user_connected';

    constructor(
        public serverId: number,
        public accountId: number
    ) {

    }
}

export class UserDisconnected {
    static readonly event = 'presence.user_disconnected';

    constructor(
        public serverId: number,
        public accountId: number
    ) {

    }
}

export class CharacterOnline {
    static readonly event = 'character.online';

    constructor(
        public accountId: number,
        public name: string
    ) {

    }
}

export class CharacterOffline {
    static readonly event = 'character.offline';

    constructor(
        public accountId: number,
        public name: string
    ) {

    }
}

export class AllCharactersOffline {

    static readonly event = 'character.all_offline';

    constructor(
        public characters: CharacterOffline[]
    ) {

    }
}
