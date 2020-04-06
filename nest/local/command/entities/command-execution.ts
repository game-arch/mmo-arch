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
    lastPerformed: Date
}
