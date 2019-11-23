import {Column, Entity, Index, PrimaryGeneratedColumn, Unique} from "typeorm";

@Entity()
@Index('mapId', ['mapId'])
@Index('location', ['mapId', 'x', 'y'])
@Unique('character', ['serverId', 'accountId', 'characterId'])
export class CharacterLocation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    serverId: number;
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
