import { Npc } from './npc'

export interface GameNpc extends Npc {

    sprite: string
    // elemental property
    affinity: string
    alignment: 'enemy' | 'friendly'
    // quests, shop, etc
    actions: string[]
    maxHealth: number
    health: number
    maxMana: number
    mana: number
}
