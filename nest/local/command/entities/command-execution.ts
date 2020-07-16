import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class CommandExecution {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    characterId: number
    @Column()
    action: string
    @Column()
    count: number
    @Column()
    delay: number
    @Column()
    available: number
    @Column()
    lastPerformed: Date
}
