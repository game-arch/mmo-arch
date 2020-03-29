import { Column, Entity, Index, PrimaryGeneratedColumn, Unique } from 'typeorm'

@Entity('distance')
@Unique(['instanceId', 'otherType', 'otherId'])
@Index(['otherType', 'otherId'])
@Index(['x', 'y'])
@Index(['otherX', 'otherY'])
export class Distance {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    instanceId: number
    @Column()
    map: string
    @Column()
    x: number
    @Column()
    y: number
    @Column()
    otherType: 'player' | 'npc'
    @Column()
    otherId: number
    @Column()
    distance: number
    @Column()
    otherX: number
    @Column()
    otherY: number

    update(instanceId, map, x, y, otherType, otherId, otherX, otherY, distance) {
        this.instanceId = instanceId
        this.map        = map
        this.x          = x
        this.y          = y
        this.otherType  = otherType
        this.otherId    = otherId
        this.otherX     = otherX
        this.otherY     = otherY
        this.distance   = distance
    }
}
