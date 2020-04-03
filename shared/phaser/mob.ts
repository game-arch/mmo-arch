export class Mob {
    instanceId: number
    mobId: number
    x: number
    y: number
    velX: number
    velY: number
    map?: string

    constructor(public name: string = '') {
    }
}
