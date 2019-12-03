import {Column, Entity, Index, PrimaryGeneratedColumn, Unique} from "typeorm";

@Entity()
@Index('mapId', ['mapId'])
@Index('location', ['mapId', 'x', 'y'])
export class NpcLocation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    world: string;
    @Column()
    npcId: number;
    @Column()
    mapId: number;
    @Column()
    x: number;
    @Column()
    y: number;
}
