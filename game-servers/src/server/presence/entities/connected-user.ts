import {Column, Entity, Index, ManyToMany, ManyToOne, PrimaryGeneratedColumn, Unique} from "typeorm";
import {RegisteredWorld}                                                              from "./registered-world";

@Entity()
@Unique('user', ['accountId'])
@Unique('character', ['characterName'])
@Index('serverSocketId', ['serverSocketId'])
export class ConnectedUser {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    world: string;
    @Column()
    serverSocketId: string;

    @Column()
    accountId: number;

    @Column({default: ''})
    characterName: string;

    constructor(accountId: number, world: string, serverSocketId: string) {
        this.accountId      = accountId;
        this.world          = world;
        this.serverSocketId = serverSocketId;
    }
}
