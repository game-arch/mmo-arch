import {Column, Entity, Index, OneToMany, PrimaryGeneratedColumn, Unique} from "typeorm";
import {ResourceDrop}                                                     from "./resource-drop";

@Entity()
@Index('type', ['type'])
@Unique('constant', ['constant'])
@Unique('name', ['name'])
export class Resource {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    type: string;
    @Column()
    constant: string;
    @Column()
    name: string;

    @OneToMany(t => ResourceDrop, d => d.resource)
    drops: ResourceDrop[];
}
