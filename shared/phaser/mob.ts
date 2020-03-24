import { Directions } from './directions'

export class Mob {
    id: number
    x: number
    y: number
    moving?: Directions

    constructor(public name: string = '') {
    }
}
