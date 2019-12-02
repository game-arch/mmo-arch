import {Column, Entity, PrimaryGeneratedColumn, Unique} from "typeorm";

@Unique('transition', ['map', 'name'])
@Entity()
export class MapTransition {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    map: string;
    @Column()
    destinationMap: string;
    @Column()
    name: string;
    @Column()
    destinationX: number;
    @Column()
    destinationY: number;
}
