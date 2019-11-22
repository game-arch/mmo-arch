import {Column, Entity, PrimaryGeneratedColumn, Unique} from "typeorm";
import {GameWorld}                                      from "../../../../lib/entities/game-world";

@Unique('socketId', ['socketId'])
@Unique('instance', ['name', 'host', 'port', 'instanceId'])
@Entity()
export class RegisteredWorld implements GameWorld {

    @PrimaryGeneratedColumn()
    id: number;
    @Column({default: ''})
    socketId: string;
    @Column({default: null})
    instanceId: number;
    @Column({default: 1})
    index: number;
    @Column()
    host: string;
    @Column('int')
    port: number;
    @Column({nullable: false})
    name: string;
    @Column('int')
    capacity: number;
    @Column('int')
    current: number;
    @Column({nullable: false})
    status: 'online' | 'offline' = 'online';
    @Column({default: false})
    full: boolean;

    constructor(host: string, port: number, instanceId: number, socketId: string, name: string, capacity: number, current: number) {
        this.host       = host;
        this.port       = port;
        this.instanceId = instanceId;
        this.socketId   = socketId;
        this.name       = name;
        this.capacity   = capacity;
        this.current    = current;

    }
}
