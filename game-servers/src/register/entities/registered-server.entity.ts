import {Socket}                                                                   from "socket.io";
import {Column, Entity, ObjectID, ObjectIdColumn, PrimaryGeneratedColumn, Unique} from "typeorm";

@Unique('socketId', ['socketId'])
@Entity()
export class RegisteredServer {

    @ObjectIdColumn()
    id: ObjectID;
    @Column()
    socketId: string;
    @Column()
    ip: string;
    @Column('int')
    capacity: number;
    @Column()
    current: number;

    constructor(ip: string, socketId: string, capacity: number, current: number) {
        this.ip       = ip;
        this.socketId = socketId;
        this.capacity = capacity;
        this.current  = current;
    }
}
