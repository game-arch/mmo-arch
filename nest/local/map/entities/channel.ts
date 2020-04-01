import { Column, Entity, JoinColumn, ManyToMany, PrimaryGeneratedColumn, Unique } from 'typeorm'
import { Player }                                                                 from './player'

@Entity()
@Unique(['map', 'channel'])
export class Channel {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    map: string
    @Column()
    channel: number
    @ManyToMany(t => Player, { cascade: true })
    @JoinColumn({ name: 'channel', referencedColumnName: 'channel' })
    players: Player[]
}
