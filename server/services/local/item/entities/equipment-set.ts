import { Column, Entity, Index, JoinColumn, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Item }                                                                  from './item'

@Entity()
@Index(['characterId'])
export class EquipmentSet {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    active: boolean = false

    @Column()
    characterId: number

    @ManyToMany(t => Item)
    @JoinColumn({ name: 'mainHandId', referencedColumnName: 'id' })
    mainHand: Item = null
    @ManyToMany(t => Item)
    @JoinColumn({ name: 'subHandId', referencedColumnName: 'id' })
    subHand: Item  = null

    @ManyToMany(t => Item)
    @JoinColumn({ name: 'headId', referencedColumnName: 'id' })
    head: Item  = null
    @ManyToMany(t => Item)
    @JoinColumn({ name: 'chestId', referencedColumnName: 'id' })
    chest: Item = null
    @ManyToMany(t => Item)
    @JoinColumn({ name: 'armsId', referencedColumnName: 'id' })
    arms: Item  = null
    @ManyToMany(t => Item)
    @JoinColumn({ name: 'legsId', referencedColumnName: 'id' })
    legs: Item  = null
    @ManyToMany(t => Item)
    @JoinColumn({ name: 'feetId', referencedColumnName: 'id' })
    feet: Item  = null

    @ManyToMany(t => Item)
    @JoinColumn({ name: 'leftRingId', referencedColumnName: 'id' })
    leftRing: Item     = null
    @ManyToMany(t => Item)
    @JoinColumn({ name: 'rightRingId', referencedColumnName: 'id' })
    rightRing: Item    = null
    @ManyToMany(t => Item)
    @JoinColumn({ name: 'leftEarringId', referencedColumnName: 'id' })
    leftEarring: Item  = null
    @ManyToMany(t => Item)
    @JoinColumn({ name: 'rightEarringId', referencedColumnName: 'id' })
    rightEarring: Item = null
    @ManyToMany(t => Item)
    @JoinColumn({ name: 'neckId', referencedColumnName: 'id' })
    neck: Item         = null
    @ManyToMany(t => Item)
    @JoinColumn({ name: 'waistId', referencedColumnName: 'id' })
    waist: Item        = null
    @ManyToMany(t => Item)
    @JoinColumn({ name: 'backId', referencedColumnName: 'id' })
    back: Item         = null
    @ManyToMany(t => Item)
    @JoinColumn({ name: 'talisman1Id', referencedColumnName: 'id' })
    talisman1: Item    = null
    @ManyToMany(t => Item)
    @JoinColumn({ name: 'talisman2Id', referencedColumnName: 'id' })
    talisman2: Item    = null
}
