import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { GemEffect }                                         from './gem-effect'

@Entity()
export class Gem {

    @PrimaryGeneratedColumn()
    id: number

    @OneToMany('GemEffect', 'gem')
    effects: GemEffect[]

    @Column()
    name: string


    static create(data: Partial<Gem>) {
        let gem = new Gem()
        Object.assign(gem, data)
        return gem
    }
}
