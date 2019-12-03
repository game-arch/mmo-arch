import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Inventory}                                         from "./inventory";
import {Item}                                              from "./item";

@Entity()
export class InventoryItem {
    @PrimaryGeneratedColumn()
    id:number;
    @ManyToOne(() => Inventory, i => i.items)
    inventory: Inventory;

    @ManyToOne(() => Item)
    item: Item;
    @Column()
    quantity:number;
}
