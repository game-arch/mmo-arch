import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('events')
export class EventEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({nullable: true})
    parentId: number;
    @Column()
    type: string;
    @Column()
    event: string;
    @Column()
    data: string;
}
