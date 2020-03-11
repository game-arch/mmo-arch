import { Column, Entity, Index, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm'
import { GameCharacter }                                                                          from '../../../../lib/interfaces/game-character'
import { CharacterStats }                                                                         from './character-stats'
import { CharacterEquipment }                                                                     from './character-equipment'
import { CharacterParameters }                                                                    from './character-parameters'

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

    @OneToOne(t => CharacterStats, s => s.character)
    stats: CharacterStats

    @OneToOne(t => CharacterParameters, s => s.character)
    parameters: CharacterParameters

    @OneToMany(t => CharacterEquipment, s => s.character)
    equipmentSets: CharacterEquipment[]

    @OneToOne(t => CharacterEquipment)
    @JoinColumn({ name: 'activeEquipmentSetId' })
    activeEquipmentSet: CharacterEquipment

    toJSON() {
        return {
            ...this,
            equipmentSets     : (this.equipmentSets || []).map(set => set.toJSON()),
            activeEquipmentSet: this.activeEquipmentSet ? this.activeEquipmentSet.toJSON() : null,
            stats             : this.stats ? this.stats.toJSON() : null,
            parameters        : this.parameters ? this.parameters.toJSON() : null
        }
    }
}
