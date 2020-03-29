import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { ItemTypes }                                                    from '../../../../shared/types/item.types'
import { Gem }                                                          from './gem'
import { Equipment }                                                    from './equipment'


@Entity()
export class Item {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    type: ItemTypes
    @OneToOne(t => Gem, { nullable: true })
    @JoinColumn({ name: 'gemId', referencedColumnName: 'id' })
    gem?: Gem
    @OneToOne(t => Equipment, { nullable: true })
    @JoinColumn({ name: 'equipmentId', referencedColumnName: 'id' })
    equipment?: Equipment

    get name() {
        if (this.gem) {
            return this.gem.name
        }
        if (this.equipment) {
            return this.equipment.name
        }
    }

    get stackable() {
        return !this.equipment && !this.gem
    }

    get maxQuantity() {
        return this.stackable ? 99 : 1
    }
}
