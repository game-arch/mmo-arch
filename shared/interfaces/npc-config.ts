import { VectorArray } from './map-config'

export interface NpcConfig {
    instanceId: number
    mobId: number
    key: string
    name: string
    map: string
    position: [number, number]
    movingBounds?: { upperLeft: VectorArray, bottomRight: VectorArray }
    path?: [number, number][]
}
