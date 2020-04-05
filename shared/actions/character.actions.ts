import { GameCharacter } from '../interfaces/game-character'

export class CreateCharacter {
    static readonly type = '[Character] Create'

    constructor(
        public accountId: number,
        public world: string,
        public name: string,
        public gender: 'male' | 'female'
    ) {

    }
}

export class CharacterCreated {
    static readonly type = '[Character] Created'

    constructor(
        public world: string,
        public characterId: number
    ) {

    }
}

export class CharacterNotCreated {
    static readonly type = '[Character] Not Created'

    constructor(public error: {
        statusCode: number
    }) {

    }
}

export class GetCharacters {
    static readonly type = '[Character] Get All'

    constructor(
        public accountId: number,
        public world: string
    ) {

    }
}
export class ReceivedCharacters {
    static readonly type = '[Character] Received Characters'

    constructor(
        public characters: GameCharacter[]
    ) {
    }
}

export class GetCharacter {
    static readonly type = '[Character] Get'

    constructor(
        public characterId: number
    ) {

    }
}

export class GetCharacterName {
    static readonly type = '[Character] Get Name'

    constructor(
        public characterId: number
    ) {

    }
}

export class CharacterOnline {
    static readonly type = '[Character] Online'

    constructor(
        public characterId: number,
        public socketId?: string
    ) {

    }
}

export class CharacterLoggedIn {
    static readonly type = '[Character] Logged In'

    constructor(
        public characterId: number,
        public name: string,
        public world: string,
        public gender: 'male' | 'female'
    ) {

    }
}

export class CharacterLoggedOut {
    static readonly type = '[Character] Logged_out'

    constructor(
        public characterId: number,
        public name: string,
        public world: string
    ) {

    }
}

export class CharacterOffline {
    static readonly type = '[Character] Offline'

    constructor(
        public characterId: number
    ) {

    }
}

export class AllCharactersOffline {
    static readonly type = '[Character] All Offline'

    constructor(
        public characters: CharacterOffline[]
    ) {

    }
}
