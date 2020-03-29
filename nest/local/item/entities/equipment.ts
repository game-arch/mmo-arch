import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Weapon }                                           from './weapon'
import { Armor }                                            from './armor'

@Entity()
export class Equipment {

    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(t => Weapon, w => w.equipment)
    weapon?: Weapon
    @OneToOne(t => Armor, a => a.equipment)
    armor?: Armor


    @Column()
    gemSlotCount: number


    get name() {
        if (this.weapon) {
            return this.weapon.name
        }
        if (this.armor) {
            return this.armor.name
        }
        return 'N/A'
    }
}
