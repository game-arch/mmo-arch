import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { EquipmentTypes }                                   from '../../../../shared/types/equipment.types'
import { Weapon }                                           from './weapon'

@Entity()
export class Equipment {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    equipmentType: EquipmentTypes
    @OneToOne(t => Weapon, w => w.equipment)
    weapon?: Weapon

    @Column()
    gemSlotCount: number


    get name() {
        if (this.weapon) {
            return this.weapon.name
        }
    }
}
