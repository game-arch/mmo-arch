import {Column, Entity, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Inventory}                                        from "./inventory";

@Entity()
export class Character {

    @PrimaryGeneratedColumn()
    id:number;
    @Column()
    accountId:number;
    @Column()
    name:string;

    @OneToOne(() => Inventory, i => i.character)
    inventory:Inventory;
}
