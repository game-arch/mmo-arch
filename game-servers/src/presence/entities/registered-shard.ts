import {Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique} from "typeorm";
import {GameShard}                                                           from "../../../lib/entities/game-shard";
import {ConnectedUser}                                                       from "./connected-user";

@Unique('socketId', ['socketId'])
@Unique('name', ['name'])
@Entity()
export class RegisteredShard implements GameShard {

    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    socketId: string;
    @Column()
    host: string;
    @Column()
    port: string;
    @Column({nullable: false})
    name: string;
    @Column('int')
    capacity: number;
    @Column('int')
    current: number;
    @Column({nullable: false})
    status: 'online' | 'offline' = 'online';

    @OneToMany(() => ConnectedUser, i => i.shard)
    users: ConnectedUser[];

    constructor(host: string, port: string, socketId: string, name: string, capacity: number, current: number) {
        this.host     = host;
        this.port     = port;
        this.socketId = socketId;
        this.name     = name;
        this.capacity = capacity;
        this.current  = current;

    }
}
