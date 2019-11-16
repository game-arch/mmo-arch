import {Entity, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Character}                                           from "./character";
import {InventoryItem}                                       from "./inventory-item";

@Entity()
export class Inventory {
    @PrimaryGeneratedColumn()
    id:number;
    @OneToOne(() => Character, c => c.inventory)
    character: Character;

    @OneToMany(() => InventoryItem, i => i.inventory)
    items: InventoryItem[];
}
