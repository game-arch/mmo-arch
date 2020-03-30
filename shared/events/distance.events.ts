import { NpcDistance } from '../interfaces/npc-distance'

export class NpcDistanceChanged {
    static readonly event = 'distance.changed'

    constructor(public data: NpcDistance) {

    }

}
