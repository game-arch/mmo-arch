import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm'

@Entity('distance')
@Unique(['instanceId', 'otherType', 'otherId'])
export class Distance {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    instanceId: number
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

    update(instanceId, x, y, otherType, otherId, otherX, otherY, distance) {
        this.instanceId = instanceId
        this.x          = x
        this.y          = y
        this.otherType  = otherType
        this.otherId    = otherId
        this.otherX     = otherX
        this.otherY     = otherY
        this.distance   = distance
    }
}
