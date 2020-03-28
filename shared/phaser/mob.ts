import { Directions } from './directions'

export class Mob {
    instanceId: number
    mobId:number
    x: number
    y: number
    map?: string
    moving?: Directions

    constructor(public name: string = '') {
    }
}
