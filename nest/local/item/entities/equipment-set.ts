import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Equipment }                                                            from './equipment'

@Entity()
@Index(['characterId'])
export class EquipmentSet {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    active: boolean = false

    @Column()
    characterId: number

    @ManyToOne(t => Equipment)
    @JoinColumn({ name: 'mainHandId', referencedColumnName: 'id' })
    mainHand: Equipment = null
    @ManyToOne(t => Equipment)
    @JoinColumn({ name: 'offHandId', referencedColumnName: 'id' })
    offHand: Equipment  = null

    @ManyToOne(t => Equipment)
    @JoinColumn({ name: 'headId', referencedColumnName: 'id' })
    head: Equipment  = null
    @ManyToOne(t => Equipment)
    @JoinColumn({ name: 'upperId', referencedColumnName: 'id' })
    upper: Equipment = null
    @ManyToOne(t => Equipment)
    @JoinColumn({ name: 'lowerId', referencedColumnName: 'id' })
    legs: Equipment  = null
}
