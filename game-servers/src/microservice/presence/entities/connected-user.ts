import {Column, Entity, Index, ManyToMany, ManyToOne, PrimaryGeneratedColumn, Unique} from "typeorm";
import {RegisteredWorld}                                                              from "./registered-world";

@Entity()
@Unique('user', ['accountId'])
@Unique('character', ['characterName'])
@Index('serverId', ['serverId'])
export class ConnectedUser {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    world: string;
    @Column()
    serverId: number;

    @Column()
    accountId: number;

    @Column({default: ''})
    characterName: string;

    constructor(accountId: number, world: string, serverId: number) {
        this.accountId      = accountId;
        this.world          = world;
        this.serverId = serverId;
    }
}
