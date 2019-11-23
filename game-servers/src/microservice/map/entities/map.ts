import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Map {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    filePath: string;
}
