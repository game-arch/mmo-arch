import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { EffectTypes }                                       from '../../../../shared/types/effect.types'
import { Effect }                                            from '../../../../shared/interfaces/effect'
import { Gem }                                               from './gem'

@Entity()
export class GemEffect implements Effect {

    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne('Gem', 'effects')
    gem: Gem

    @Column()
    type: EffectTypes

    @Column()
    potency: number

    static create(data: Partial<GemEffect>) {
        let effect = new GemEffect()
        Object.assign(effect, data)
        return effect
    }
}
