export interface NpcConfig {
    instanceId: number
    mobId: number
    name: string
    map: string
    position: [number, number]
    moveInterval: number
    movingBounds: [number, number][]
    path: [number, number][]
}
