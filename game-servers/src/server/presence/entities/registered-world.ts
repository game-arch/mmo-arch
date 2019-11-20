import {Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique} from "typeorm";
import {ConnectedUser}                                                       from "./connected-user";
import {GameWorld}                                                           from "../../../../lib/entities/game-world";

@Unique('socketId', ['socketId'])
@Unique('name', ['name'])
@Entity()
export class RegisteredWorld implements GameWorld {

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

    @OneToMany(() => ConnectedUser, i => i.world)
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
