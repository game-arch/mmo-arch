import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { ItemTypes }                              from '../../../../lib/types/item.types'
import { EquipmentTypes }                         from '../../../../lib/types/equipment.types'

@Entity()
export class Item {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    type: ItemTypes

    @Column()
    equipmentType?: EquipmentTypes | null

    @Column()
    name: string


}
