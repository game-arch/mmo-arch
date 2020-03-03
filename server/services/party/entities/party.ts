import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
@Index('party', ['partyId', 'name'])
export class Party {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    partyId: number
    @Column()
    name: string

    @Column()
    partyMembers: number

    @Column()
    members: any

    @Column()
    invitees: any

    @Column()
    leader: string
}
