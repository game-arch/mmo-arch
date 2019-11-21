import {Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, Unique} from "typeorm";
import {RegisteredWorld}                                                       from "./registered-world";

@Entity()
@Unique('world-user', ['world', 'accountId'])
export class ConnectedUser {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    world: string;

    @Column()
    accountId: number;

    constructor(accountId: number, world: string) {
        this.accountId = accountId;
        this.world     = world;
    }
}
