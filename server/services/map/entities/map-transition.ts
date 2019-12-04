import {Column, Entity, PrimaryGeneratedColumn, Unique} from "typeorm";

@Unique('mapTransition', ['map', 'name'])
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
    @Column('int')
    destinationX: number;
    @Column('int')
    destinationY: number;
}
