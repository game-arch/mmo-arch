export interface NpcConfig {
    instanceId: number
    mobId: number
    name:string
    map: string
    position: [number, number]
    respawnInterval: number
    moveInterval: number
    moveDistance: number
    movingBounds: [number, number][]
    path: [number, number][]
}
