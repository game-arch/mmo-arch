import {Column, Entity, Index, PrimaryGeneratedColumn, Unique} from "typeorm";

@Entity()
@Index('mapId', ['mapId'])
@Index('location', ['mapId', 'x', 'y'])
@Unique('character', ['world', 'accountId', 'characterId'])
export class PlayerLocation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    world: string;
    @Column()
    accountId: number;
    @Column()
    characterId: number;
    @Column()
    mapId: number;
    @Column()
    x: number;
    @Column()
    y: number;
}
