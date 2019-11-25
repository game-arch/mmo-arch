export interface MapConfig {
    name: string
    width: number
    height: number
    collisions: CollisionConfig[]
}

export interface CollisionConfig {
    mass?: number
    position: [number, number]
    shape: 'circle' | 'rectangle' | 'polygon'
    points?: [number, number][]
    radius?: number
    width?: number
    height?: number
    originX?: number
    originY?: number
    rotation?: number
}
