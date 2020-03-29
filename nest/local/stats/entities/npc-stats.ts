import {Stats}                                  from "../../../../shared/interfaces/stats";
import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class NpcStats implements Stats {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    agility: number;
    @Column()
    charisma: number;
    @Column()
    dexterity: number;
    @Column()
    intelligence: number;
    @Column()
    level: number;
    @Column()
    strength: number;
    @Column()
    vitality: number;
    @Column()
    wisdom: number;
}
