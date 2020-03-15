import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Item }                                                          from './item'

@Entity()
export class ItemEffect {

    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne('Item')
    @JoinColumn({ name: 'itemId', referencedColumnName: 'id' })
    item: Item

    @Column()
    effect: string

    @Column()
    potency: number
}
