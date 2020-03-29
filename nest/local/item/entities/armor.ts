import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Equipment }  from './equipment'
import { ArmorTypes } from '../../../../shared/types/equipment.types'

@Entity()
export class Armor {

    @PrimaryGeneratedColumn()
    id: number
    @Column()
    type: ArmorTypes
    @OneToOne(t => Equipment, e => e.armor)
    @JoinColumn({ name: 'equipmentId', referencedColumnName: 'id' })
    equipment: Equipment
    @Column()
    name: string
    @Column()
    style: string
    @Column()
    color: string


}
