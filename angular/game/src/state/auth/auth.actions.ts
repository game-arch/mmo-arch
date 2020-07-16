export class SetToken {
    static readonly type = '[Auth] Set Token'

    constructor(public token: string = '') {

    }
}
