import {Column, Entity, Index, PrimaryGeneratedColumn, Unique} from "typeorm";

@Entity()
@Index('mapId', ['mapId'])
@Index('location', ['mapId', 'x', 'y'])
export class ResourceLocation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    resourceId: number;
    @Column()
    mapId: number;
    @Column()
    x: number;
    @Column()
    y: number;
}
