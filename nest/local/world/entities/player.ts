import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Player {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    instance: number
    @Column()
    map:string = 'tutorial'
    @Column()
    channel: number = 1
    @Column()
    accountId: number
    @Column({ length: 255 })
    socketId: string
    @Column({ nullable: true })
    characterId: number
    @Column({ length: 255, nullable: true })
    characterName: string

    get character() {
        if (this.characterId !== null) {
            return {
                id  : this.characterId,
                name: this.characterName
            }
        }
        return null
    }
}
