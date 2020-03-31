import { Column, Entity, JoinColumn, ManyToMany, PrimaryGeneratedColumn, Unique } from 'typeorm'
import { Player }                                                                 from './player'

@Entity()
@Unique(['map', 'instanceNumber'])
export class MapInstance {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    map: string
    @Column()
    instanceNumber: number
    @ManyToMany(t => Player, { cascade: true })
    @JoinColumn({ name: 'instanceNumber', referencedColumnName: 'instance' })
    players: Player[]
}
