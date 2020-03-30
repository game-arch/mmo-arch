import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { TWO_HANDED, WeaponTypes }                from '../../../../shared/types/equipment.types'

@Entity()
export class Weapon {

    @PrimaryGeneratedColumn()
    id: number
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
    @Column()
    gemSlotCount: number

    get isTwoHanded() {
        return TWO_HANDED.includes(this.type)
    }

    static create(data: Partial<Weapon>) {
        let weapon = new Weapon()
        Object.assign(weapon, data)
        return weapon
    }
}
