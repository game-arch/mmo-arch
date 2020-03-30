import { VectorArray } from './map-config'

export interface NpcConfig {
    instanceId: number
    mobId: number
    name: string
    map: string
    position: [number, number]
    moveStart:number
    moveInterval: number
    movingBounds: { upperLeft: VectorArray, bottomRight: VectorArray }
    path: [number, number][]
}
