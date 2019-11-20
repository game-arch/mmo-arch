import {Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique} from "typeorm";
import {RegisteredWorld}                                           from "./registered-world";

@Entity()
@Unique('world-user', ['world', 'accountId'])
export class ConnectedUser {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(t => RegisteredWorld, s => s.users)
    world: RegisteredWorld;

    @Column()
    accountId: number;

    constructor(accountId: number, world: RegisteredWorld) {
        this.accountId = accountId;
        this.world     = world;
    }
}
