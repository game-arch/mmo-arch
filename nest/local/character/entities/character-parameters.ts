import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'


@Entity()
export class CharacterParameters {

    @PrimaryGeneratedColumn()
    id: number


    @Column()
    health = 100
    @Column()
    mana   = 100

    @Column()
    physicalDamage   = 1
    @Column()
    physicalDefense  = 1
    @Column()
    physicalAccuracy = 1
    @Column()
    physicalEvasion  = 1

    @Column()
    magicDamage   = 1
    @Column()
    magicDefense  = 1
    @Column()
    magicAccuracy = 1
    @Column()
    magicEvasion  = 1

}
