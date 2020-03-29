import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { GemEffect }                                 from './gem-effect'

@Entity()
export class Gem {

    @PrimaryGeneratedColumn()
    id: number

    @OneToMany('GemEffect', 'gem')
    effects: GemEffect[]
}
