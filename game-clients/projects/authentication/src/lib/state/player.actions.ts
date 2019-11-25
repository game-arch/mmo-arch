export class SetToken {
    static readonly type = '[Player] Set Token';

    constructor(public token: string = '') {

    }
}

export class SetWorld {
    static readonly type = '[Player] Set World';

    constructor(public name: string = '') {

    }
}
export class SetCharacter {
    static readonly type = '[Player] Set Character';

    constructor(public name: string = '') {

    }
}
