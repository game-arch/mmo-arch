import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
@Entity()
export class Armor {

    @PrimaryGeneratedColumn()
    id: number
    @Column()
    name:string
    @Column()
    style:string
    @Column()
    color:string


}
