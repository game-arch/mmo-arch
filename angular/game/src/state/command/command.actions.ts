export class BaseCommand {
    constructor(public status: boolean, public duration?: number) {
    }
}

export class OverloadedAction extends BaseCommand {
    static readonly type = '[Command] Overloaded Action'

}

export class MoveUp extends BaseCommand {
    static readonly type = '[Command] Move Up'

}

export class MoveRight extends BaseCommand {
    static readonly type = '[Command] Move Right'

}

export class MoveDown extends BaseCommand {
    static readonly type = '[Command] Move Down'

}

export class MoveLeft extends BaseCommand {
    static readonly type = '[Command] Move Left'

}

export class PushMobs extends BaseCommand {
    static readonly type = '[Command] Push Mobs'

    constructor(public status: boolean, public duration?: number) {
        super(status, duration)
    }
}

export class PushAreaMobs extends BaseCommand {
    static readonly type = '[Command] Push Area Mobs'

    constructor(public status: boolean, public duration?: number) {
        super(status, duration)
    }
}
