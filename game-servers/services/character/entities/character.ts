import {Column, Entity, Index, PrimaryGeneratedColumn, Unique} from "typeorm";
import {GameCharacter}                                         from "../../../lib/interfaces/game-character";

@Entity()
@Index('user', ['accountId', 'name'])
@Index('status', ['status'])
@Unique('name', ['world','name'])
export class Character implements GameCharacter {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    accountId: number;
    @Column()
    world:string;

    @Column()
    name: string;

    @Column()
    gender: 'male' | 'female' = 'male';

    @Column()
    status: 'online' | 'offline' = 'offline';

    @Column({nullable: true})
    lastOnline: Date;

}