import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {InventoryItem}                                     from "./inventory-item";

@Entity()
export class Inventory {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    characterId: number;
    @OneToMany(() => InventoryItem, i => i.inventory)
    items: InventoryItem[];
}
