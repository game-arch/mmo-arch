export interface NpcConfig {
    id: number
    position: [number, number]
    respawnInterval: number
    movingBounds: [number, number][]
    path: [number, number][]
}
