export interface NpcDistance {
    instanceId: number
    map: string
    x: number
    y: number
    otherType: 'player' | 'npc'
    otherId: number
    distance: number
    otherX: number
    otherY: number
}
