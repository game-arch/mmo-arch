import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm'

@Entity('mob_distance')
@Unique(['mobInstanceId', 'playerInstanceId'])
@Unique(['mobInstanceId', 'npcInstanceId'])
export class MobDistance {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    mobInstanceId: number
    @Column({ nullable: true })
    npcInstanceId?: number
    @Column({ nullable: true })
    playerInstanceId?: number
    @Column()
    distance: number
    @Column()
    otherX: number
    @Column()
    otherY: number

    update(mobInstanceId, npcInstanceId, playerInstanceId, otherX, otherY, distance) {
        this.mobInstanceId = mobInstanceId
        this.npcInstanceId = npcInstanceId
        this.playerInstanceId = playerInstanceId
        this.otherX = otherX
        this.otherY = otherY
        this.distance = distance
    }
}
