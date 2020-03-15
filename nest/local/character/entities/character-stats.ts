import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class CharacterStats {

    static DEFAULT_STAT      = 5
    static DEFAULT_AVAILABLE = 10
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    level: number        = 1
    @Column()
    strength: number     = CharacterStats.DEFAULT_STAT
    @Column()
    dexterity: number    = CharacterStats.DEFAULT_STAT
    @Column()
    vitality: number     = CharacterStats.DEFAULT_STAT
    @Column()
    agility: number      = CharacterStats.DEFAULT_STAT
    @Column()
    intelligence: number = CharacterStats.DEFAULT_STAT
    @Column()
    wisdom: number       = CharacterStats.DEFAULT_STAT
    @Column()
    charisma: number     = CharacterStats.DEFAULT_STAT
    @Column()
    available: number    = CharacterStats.DEFAULT_AVAILABLE

}
