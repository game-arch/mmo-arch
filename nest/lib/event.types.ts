import { WorldConstants } from './constants/world.constants'
import { PerformCommand } from '../../shared/actions/command.actions'

export class GlobalEvent {

    constructor(public event: string) {
        this.event = this.event.replace(/[\[\]]/g, '').replace(/\s/g, '_')
    }
}

export class WorldEvent {
    world = WorldConstants.CONSTANT

    constructor(public event: string, public map?: string) {
        this.event = this.event.replace(/[\[\]]/g, '').replace(/\s/g, '_')
    }
}

export class CommandEvent {
    world  = WorldConstants.CONSTANT
    event  = PerformCommand.type.replace(/[\[\]]/g, '').replace(/\s/g, '_')
    status = 'performed'

    constructor(public action: string) {
        this.action = this.action.replace(/[\[\]]/g, '').replace(/\s/g, '_')
    }
}
