import { Directions } from '../../../../../shared/phaser/directions'

export class KeyDown {
    static readonly type = '[Scene] Key Down'

    constructor(public key: string) {
    }
}

export class KeyUp {
    static readonly type = '[Scene] Key Up'

    constructor(public key: string) {
    }
}

export class KeyHeldFor {
    static readonly type = '[Scene] Key Held For'

    constructor(public key: string, public milliseconds: number) {
    }
}

export class HoldingKey {
    static readonly type = '[Scene] Holding Key'

    constructor(public key:string, public milliseconds: number) {
    }
}

export class JoystickInput {
    static readonly type = '[Scene] Joystick Input'

    constructor(public directions: Directions) {
    }
}
