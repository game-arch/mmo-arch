import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Item }                                                                 from './item'

@Entity()
@Index(['characterId'])
export class EquipmentSet {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    active = false

    @Column()
    characterId: number

    @ManyToOne(t => Item)
    @JoinColumn({ name: 'mainHandId', referencedColumnName: 'id' })
    mainHand: Item = null
    @ManyToOne(t => Item)
    @JoinColumn({ name: 'subHandId', referencedColumnName: 'id' })
    subHand: Item  = null

    @ManyToOne(t => Item)
    @JoinColumn({ name: 'headId', referencedColumnName: 'id' })
    head: Item  = null
    @ManyToOne(t => Item)
    @JoinColumn({ name: 'chestId', referencedColumnName: 'id' })
    chest: Item = null
    @ManyToOne(t => Item)
    @JoinColumn({ name: 'armsId', referencedColumnName: 'id' })
    arms: Item  = null
    @ManyToOne(t => Item)
    @JoinColumn({ name: 'legsId', referencedColumnName: 'id' })
    legs: Item  = null
    @ManyToOne(t => Item)
    @JoinColumn({ name: 'feetId', referencedColumnName: 'id' })
    feet: Item  = null

    @ManyToOne(t => Item)
    @JoinColumn({ name: 'leftRingId', referencedColumnName: 'id' })
    leftRing: Item     = null
    @ManyToOne(t => Item)
    @JoinColumn({ name: 'rightRingId', referencedColumnName: 'id' })
    rightRing: Item    = null
    @ManyToOne(t => Item)
    @JoinColumn({ name: 'leftEarringId', referencedColumnName: 'id' })
    leftEarring: Item  = null
    @ManyToOne(t => Item)
    @JoinColumn({ name: 'rightEarringId', referencedColumnName: 'id' })
    rightEarring: Item = null
    @ManyToOne(t => Item)
    @JoinColumn({ name: 'neckId', referencedColumnName: 'id' })
    neck: Item         = null
    @ManyToOne(t => Item)
    @JoinColumn({ name: 'waistId', referencedColumnName: 'id' })
    waist: Item        = null
    @ManyToOne(t => Item)
    @JoinColumn({ name: 'backId', referencedColumnName: 'id' })
    back: Item         = null
}
