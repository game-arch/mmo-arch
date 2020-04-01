import { GameCharacter } from '../../../../shared/interfaces/game-character'

export class SystemMessage {
    static readonly event = 'chat.system_message'

    constructor(public message: string, public map?: string, public channel?: number) {

    }
}

export class ErrorMessage {
    static readonly event = 'chat.error_message'

    constructor(public message: string) {

    }
}

export class LocalMessage {
    static readonly event = 'chat.local_message'

    constructor(public sender: GameCharacter, public map: string, public channel: number, public x: number, public y: number, public message: string) {

    }
}

export class ZoneMessage {
    static readonly event = 'chat.zone_message'

    constructor(public sender: GameCharacter, public map: string, public channel: number, public message: string) {

    }
}

export class RegionMessage {
    static readonly event = 'chat.region_message'

    constructor(public sender: GameCharacter, public region: string, public message: string) {

    }
}

export class TradeMessage {
    static readonly event = 'chat.trade_message'

    constructor(public sender: GameCharacter, public message: string) {

    }
}

export class GlobalMessage {
    static readonly event = 'chat.global_message'

    constructor(public sender: GameCharacter, public message: string) {

    }
}

export class PrivateMessage {
    static readonly event = 'chat.private_message'

    constructor(public sender: GameCharacter, public recipient: GameCharacter, public message: string) {

    }
}
