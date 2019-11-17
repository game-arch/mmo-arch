import {Column, Entity, PrimaryGeneratedColumn, Unique} from "typeorm";

@Unique('socketId', ['socketId'])
@Entity()
export class RegisteredServer {

    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    socketId: string;
    @Column()
    ip: string;
    @Column()
    name: string;
    @Column('int')
    capacity: number;
    @Column()
    current: number;

    constructor(ip: string, socketId: string, name: string, capacity: number, current: number) {
        this.ip       = ip;
        this.socketId = socketId;
        this.name     = name;
        this.capacity = capacity;
        this.current  = current;
    }
}
