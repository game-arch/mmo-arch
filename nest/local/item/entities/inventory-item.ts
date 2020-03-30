import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Item }                                                                                from './item'
import { Gem }                                                                                 from './gem'

@Entity()
export class InventoryItem {
    private _quantity: number
    @Column()
    get quantity(): number {
        return this._quantity
    }

    set quantity(value: number) {
        if (this.item) {
            if (value <= this.item.maxQuantity) {
                this._quantity = value
                return
            }
        }
        this._quantity = 1
    }

    @PrimaryGeneratedColumn()
    id: number
    @Column()
    characterId: number

    @OneToOne(t => Item)
    @JoinColumn({ name: 'itemConstant', referencedColumnName: 'constant' })
    item: Item

    @ManyToMany(t => Gem)
    @JoinTable({
        name      : 'inventory_item_gem',
        joinColumn: { referencedColumnName: 'id', name: 'id' }
    })
    private _gems: Gem[]
    get gems() {
        return [].concat(this._gems)
    }

    get equipment(): { name: string, gemSlotCount: number } {
        return this.item.armor || this.item.weapon
    }

    addGem(gem: Gem) {
        if (this.equipment && this.equipment.gemSlotCount > this._gems.length) {
            this._gems.push(gem)
        }
    }

    removeGem(gem: Gem) {
        if (this._gems.includes(gem)) {
            this._gems.splice(this._gems.indexOf(gem), 1)
        }
    }
}
