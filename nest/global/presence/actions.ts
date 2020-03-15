export class PresenceOnline {
    static readonly event = 'presence.online'
}

export class GetServers {
    static readonly event = 'presence.server_list'
}

export class RegisterServer {
    static readonly event = 'presence.register_server'

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
    static readonly event = 'presence.server_offline'

    constructor(
        public serverId: number
    ) {

    }
}
