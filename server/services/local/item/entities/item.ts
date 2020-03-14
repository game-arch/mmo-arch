import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ItemTypes }                                         from '../../../../lib/types/item.types'
import { EquipmentTypes }                                    from '../../../../lib/types/equipment.types'
import { ItemEffect }                                        from './item-effect'

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

    @OneToMany('ItemEffect', 'item')
    effects: ItemEffect[]

}
