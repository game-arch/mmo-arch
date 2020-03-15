import { Npc } from '../../../../shared/interfaces/npc'

export interface NpcPlacement {

    npc: Npc

    x: number
    y: number

    followsPlayers:boolean
    radius:number

}
