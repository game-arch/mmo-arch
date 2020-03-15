import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
@Index('npcMap', ['map'])
@Index('npcLocation', ['map', 'x', 'y'])
export class NpcLocation {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    world: string
    @Column()
    npcId: number
    @Column()
    map: string
    @Column('int')
    x: number
    @Column('int')
    y: number
}
