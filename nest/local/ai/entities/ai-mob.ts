import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export class AiMob {
    @PrimaryColumn()
    id: number
    @Column()
    name: string
    @Column()
    type: 'npc' | 'enemy' | 'ally'
    @Column()
    family:string
}
