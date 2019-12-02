import {Column, Entity, PrimaryGeneratedColumn, Unique} from "typeorm";

@Unique('transition', ['mapOne', 'mapTwo', 'name'])
@Entity()
export class MapTransition {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    mapOne: string;
    @Column()
    mapTwo: string;
    @Column()
    name: string;
    @Column()
    mapOneX: number;
    @Column()
    mapOneY: number;
    @Column()
    mapTwoX: number;
    @Column()
    mapTwoY: number;
}
