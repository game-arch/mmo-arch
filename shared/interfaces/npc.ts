import { NpcTypes } from '../types/npc.types'
import { Effect }   from './effect'
import { Stats }    from './stats'

export interface Npc {
    id: number

    name: string

    spawn: {x:number, y:number}

    path: { x: number, y: number }[]

    types: NpcTypes[]

    stats?: Stats

    effects: Effect[]
}
