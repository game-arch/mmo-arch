import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Equipment }                                                    from './equipment'

@Entity()
export class Weapon {

    @PrimaryGeneratedColumn()
    id: number
    @OneToOne(t => Equipment, e => e.weapon)
    @JoinColumn({ name: 'equipmentId', referencedColumnName: 'id' })
    equipment: Equipment
    @Column()
    type: string
    @Column()
    name: string
    @Column()
    damage: number
    @Column()
    delay: number
    @Column()
    distance: number
}
