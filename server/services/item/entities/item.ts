import {Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {ItemConfiguration}                                                                   from "./item-configuration";

@Entity()
export class Item {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string;
    @Column()
    constant: string;
    @Column()
    name: string;
    @Column()
    stackable: boolean;
    /**
     * JSON file path that adds properties to
     */
    @ManyToMany(() => ItemConfiguration, i => i.items)
    @JoinTable()
    configurations: ItemConfiguration[];
}
