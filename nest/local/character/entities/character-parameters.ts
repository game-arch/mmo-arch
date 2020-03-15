import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'


@Entity()
export class CharacterParameters {

    @PrimaryGeneratedColumn()
    id: number


    @Column()
    health: number = 100
    @Column()
    mana: number   = 100

    @Column()
    physicalDamage: number   = 1
    @Column()
    physicalDefense: number  = 1
    @Column()
    physicalAccuracy: number = 1
    @Column()
    physicalEvasion: number  = 1

    @Column()
    magicDamage: number   = 1
    @Column()
    magicDefense: number  = 1
    @Column()
    magicAccuracy: number = 1
    @Column()
    magicEvasion: number  = 1

}
