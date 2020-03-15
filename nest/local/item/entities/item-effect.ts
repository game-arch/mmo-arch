import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Item }                                                          from './item'
import { EffectTypes }                                                   from '../../../../shared/types/effect.types'
import { Effect }                                                        from '../../../../shared/interfaces/effect'

@Entity()
export class ItemEffect implements Effect {

    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne('Item')
    @JoinColumn({ name: 'itemId', referencedColumnName: 'id' })
    item: Item

    @Column()
    type: EffectTypes

    @Column()
    potency: number
}
