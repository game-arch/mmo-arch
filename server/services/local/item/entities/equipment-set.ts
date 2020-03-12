import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
@Index(['characterId'])
export class EquipmentSet {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    active: boolean = false

    @Column()
    characterId: number

    @Column({ nullable: true })
    mainHand: number = null
    @Column({ nullable: true })
    subHand: number  = null

    @Column({ nullable: true })
    head: number  = null
    @Column({ nullable: true })
    chest: number = null
    @Column({ nullable: true })
    arms: number  = null
    @Column({ nullable: true })
    legs: number  = null
    @Column({ nullable: true })
    feet: number  = null

    @Column({ nullable: true })
    leftRing: number  = null
    @Column({ nullable: true })
    rightRing: number = null
    @Column({ nullable: true })
    neck: number      = null
    @Column({ nullable: true })
    waist: number     = null
    @Column({ nullable: true })
    back: number      = null
}
