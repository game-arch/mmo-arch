import {Column, Entity, PrimaryGeneratedColumn, Unique} from "typeorm";
import {GameShard}                                      from "../../../../game-clients/lib/entities/game-shard";

@Unique('socketId', ['socketId'])
@Unique('name', ['name'])
@Entity()
export class RegisteredShard implements GameShard {

    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    socketId: string;
    @Column()
    ip: string;
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

    constructor(ip: string, port: string, socketId: string, name: string, capacity: number, current: number) {
        this.ip       = ip;
        this.port     = port;
        this.socketId = socketId;
        this.name     = name;
        this.capacity = capacity;
        this.current  = current;

    }
}
