import {Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique} from "typeorm";
import {RegisteredShard}                                           from "./registered-shard";

@Entity()
@Unique('shard-user', ['shard', 'accountId'])
export class ConnectedUser {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(t => RegisteredShard, s => s.users)
    shard: RegisteredShard;

    @Column()
    accountId: number;

    constructor(accountId:number, shard:RegisteredShard) {
        this.accountId = accountId;
        this.shard = shard;
    }
}
