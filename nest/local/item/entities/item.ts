import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm'
import { ItemTypes }                                                            from '../../../../shared/types/item.types'
import { Gem }                                                                  from './gem'
import { Armor }                                                                from './armor'
import { Weapon }                                                               from './weapon'


@Entity()
@Unique(['constant'])
export class Item {

    @PrimaryGeneratedColumn()
    id: number
    @Column()
    constant: string

    @Column()
    type: ItemTypes
    @OneToOne(t => Gem, { nullable: true, cascade: true })
    @JoinColumn({ name: 'gemId', referencedColumnName: 'id' })
    gem?: Gem
    @OneToOne(t => Armor, { nullable: true, cascade: true })
    @JoinColumn({ name: 'armorId', referencedColumnName: 'id' })
    armor?: Armor
    @OneToOne(t => Weapon, { nullable: true, cascade: true })
    @JoinColumn({ name: 'weaponId', referencedColumnName: 'id' })
    weapon?: Weapon

    get name() {
        if (this.gem) {
            return this.gem.name
        }
        if (this.armor) {
            return this.armor.name
        }
        if (this.weapon) {
            return this.weapon.name
        }
    }

    get stackable() {
        return !this.weapon && !this.armor && !this.gem
    }

    get maxQuantity() {
        return this.stackable ? 99 : 1
    }

    static create(data: Partial<Item>) {
        let item = new Item()
        Object.assign(item, data)
        if (!item.constant) {
            throw new Error('All items must have constants')
        }
        if (!item.weapon && !item.armor && !item.gem) {
            throw new Error('Must create an item of some kind')
        }
        return item
    }
}
