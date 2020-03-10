import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "parties" })
@Index("party", ["partyId", "name"])
export class Party {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    partyId: number;
    @Column()
    name: string;

    @Column()
    partyMembers: number;

    @Column("simple-array")
    members: string[];

    @Column("simple-array")
    invitees: string[];

    @Column()
    leader: string;
}
