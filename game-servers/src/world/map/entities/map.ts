import {Column, Entity, PrimaryGeneratedColumn, Unique} from "typeorm";

@Unique('name', ['name'])
@Unique('constant', ['constant'])
@Entity()
export class Map {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    constant:string;
    @Column()
    name: string;
}
