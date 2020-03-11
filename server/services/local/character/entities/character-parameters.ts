import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'


@Entity()
export class CharacterParameters {

    @PrimaryGeneratedColumn()
    id: number

    @OneToOne('Character', 'parameters')
    @JoinColumn({ name: 'characterId' })
    character: any


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

    toJSON() {
        let obj = {
            ...this
        }
        delete obj.character
        return obj
    }
}
