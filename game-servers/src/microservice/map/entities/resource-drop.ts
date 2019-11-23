import {Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn, Unique} from "typeorm";
import {Resource}                                                         from "./resource";

@Index('item', ['itemId'])
@Unique('resourceItem', ['resource', 'itemId'])
@Entity()
export class ResourceDrop {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(t => Resource, r => r.drops)
    resource: Resource;

    @Column()
    itemId: number;
    @Column({default: 0})
    minQuantity: number;
    @Column({default: 1})
    maxQuantity: number;
    @Column('decimal', {default: 1.00})
    chance: number;
}
