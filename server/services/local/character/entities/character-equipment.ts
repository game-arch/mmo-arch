import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Character }                                                     from './character'

@Entity()
export class CharacterEquipment {

    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(t => Character, c => c.equipmentSets)
    @JoinColumn({ name: 'characterId' })
    character: Character

    @Column()
    mainHand: number = null
    @Column()
    subHand: number  = null

    @Column()
    head: number  = null
    @Column()
    chest: number = null
    @Column()
    arms: number  = null
    @Column()
    legs: number  = null
    @Column()
    feet: number  = null

    @Column()
    leftRing: number  = null
    @Column()
    rightRing: number = null
    @Column()
    neck: number      = null
    @Column()
    waist: number     = null
    @Column()
    back: number      = null

    toJSON() {
        let obj = {
            ...this,
        }
        delete obj.character
        return obj
    }
}
