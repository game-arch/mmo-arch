import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'parties' })
@Index('party', ['name'])
export class Party {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    name: string

    @Column()
    partyMembers: number

    @Column('simple-array')
    members: number[]

    @Column('simple-array')
    invitees: number[]

    @Column()
    leader: number
}
