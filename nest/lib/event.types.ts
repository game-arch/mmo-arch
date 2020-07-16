import { WorldConstants } from './constants/world.constants'
import { MapConstants }   from '../local/map/constants'
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

export class MapEvent {
    world   = WorldConstants.CONSTANT
    map     = MapConstants.MAP
    channel = MapConstants.CHANNEL

    constructor(public event: string, map?: string, channel?: number) {
        this.event   = this.event.replace(/[\[\]]/g, '').replace(/\s/g, '_')
        this.map     = map || this.map
        this.channel = channel || this.channel
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
