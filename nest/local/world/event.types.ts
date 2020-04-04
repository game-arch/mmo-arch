import { WorldConstants } from '../../lib/constants/world.constants'
import { MapConstants }   from '../map/constants'
import { PerformCommand } from '../../../shared/events/command.events'

export class WorldEvent {
    world = WorldConstants.CONSTANT

    constructor(public event: string, public map?: string) {
    }
}

export class MapEvent {
    world   = WorldConstants.CONSTANT
    map     = MapConstants.MAP
    channel = MapConstants.CHANNEL

    constructor(public event: string, map?: string, channel?: number) {
        this.map     = map || this.map
        this.channel = channel || this.channel
    }
}

export class ActionEvent {
    world = WorldConstants.CONSTANT
    event = PerformCommand.event

    constructor(public action: string) {
    }
}
