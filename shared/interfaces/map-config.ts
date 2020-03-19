export type VectorArray = [number, number]

export interface MapConfig {
    constant: string
    name: string
    width?: number
    height?: number
    collisions?: CollisionConfig[]
    transitions?: TransitionConfig[]
    transitionLandings?: { [id: string]: VectorArray }
    tilesetName?: string
    tiles?: string
}

export interface CollisionConfig {
    mass?: number
    position: VectorArray
    shape: 'circle' | 'rectangle' | 'polygon'
    points?: VectorArray[]
    radius?: number
    width?: number
    height?: number
    rotation?: number
    solid?: boolean
}

export interface TransitionConfig {
    position: VectorArray
    width: number
    height: number
    landingMap: string
    landingId: string
}
