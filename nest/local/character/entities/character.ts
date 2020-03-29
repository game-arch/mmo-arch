import {Column, Entity, Index, PrimaryGeneratedColumn, Unique} from 'typeorm'
import {GameCharacter}                                         from '../../../../shared/interfaces/game-character'

@Entity()
@Index('user', ['accountId', 'name'])
@Index('status', ['status'])
@Unique('socket', ['socketId'])
@Unique('name', ['world', 'name'])
export class Character implements GameCharacter {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    accountId: number
    @Column()
    world: string

    @Column()
    name: string

    @Column()
    gender: 'male' | 'female' = 'male'

    @Column()
    status: 'online' | 'offline' = 'offline'

    @Column({nullable: true})
    lastOnline: Date

    @Column({nullable: true})
    socketId: string
}
