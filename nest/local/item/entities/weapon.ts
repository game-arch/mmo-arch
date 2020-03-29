import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Equipment }                                                    from './equipment'
import { WeaponTypes }                                                  from '../../../../shared/types/equipment.types'

@Entity()
export class Weapon {

    @PrimaryGeneratedColumn()
    id: number
    @OneToOne(t => Equipment, e => e.weapon)
    @JoinColumn({ name: 'equipmentId', referencedColumnName: 'id' })
    equipment: Equipment
    @Column()
    type: WeaponTypes
    @Column()
    name: string
    @Column()
    damage: number
    @Column()
    offHandDamage: number
    @Column()
    delay: number
    @Column()
    distance: number

    get isTwoHanded() {
        return [WeaponTypes.GREAT_SWORD, WeaponTypes.GREAT_AXE, WeaponTypes.GREAT_HAMMER, WeaponTypes.SPEAR, WeaponTypes.STAFF].includes(<any>this.type)
    }
}
