import { Column, Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm'
import { GameCharacter }                                                               from '../../../../lib/interfaces/game-character'
import { CharacterStats }                                                              from './character-stats'
import { CharacterParameters }                                                         from './character-parameters'

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

    @Column({ nullable: true })
    lastOnline: Date

    @Column({ nullable: true })
    socketId: string

    @OneToOne('CharacterStats', 'character', { cascade: true })
    @JoinColumn()
    stats: CharacterStats

    @OneToOne('CharacterParameters', 'character', { cascade: true })
    @JoinColumn()
    parameters: CharacterParameters
}
