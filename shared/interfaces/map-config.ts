export type VectorArray = [number, number]

export interface MapConfig {
    constant: string
    name: string
    width?: number
    height?: number
    layers: { [key: string]: LayerConfig }
    tilesetName?: string
    tiles?: string
    npcs?: {
        [id: number]: VectorArray
    }
}

export interface LayerConfig {
    exits?: { [id: string]: TransitionConfig }
    entrances?: { [id: string]: VectorArray }
    collisions?: { [id: string]: CollisionConfig[] }

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
    solid?: boolean,
    color?: number
}

export interface TransitionConfig {
    position: VectorArray
    width: number
    height: number
    landingMap: string
    landingId: string
}
