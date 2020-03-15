import { NpcTypes } from '../types/npc.types'
import { Effect }   from './effect'
import { Stats }    from './stats'

export interface Npc {
    id: number

    name: string

    types: NpcTypes[]

    stats: Stats

    effects: Effect[]
}
