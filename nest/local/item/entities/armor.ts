import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { ArmorParts, ArmorTypes }                 from '../../../../shared/types/equipment.types'

@Entity()
export class Armor {

    @PrimaryGeneratedColumn()
    id: number
    @Column()
    part: ArmorParts
    @Column()
    type: ArmorTypes
    @Column()
    name: string
    @Column()
    style: string
    @Column()
    color: number
    @Column()
    gemSlotCount: number


    static create(data: Partial<Armor>) {
        let armor = new Armor()
        Object.assign(armor, data)
        return armor
    }
}
