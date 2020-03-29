import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm'

@Entity('distance')
@Unique(['instanceId', 'otherType', 'otherId'])
export class Distance {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    instanceId: number
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

    update(instanceId, otherType, otherId, otherX, otherY, distance) {
        this.instanceId = instanceId
        this.otherType  = otherType
        this.otherId    = otherId
        this.otherX     = otherX
        this.otherY     = otherY
        this.distance   = distance
    }
}
