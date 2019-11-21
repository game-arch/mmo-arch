import {Column, Entity, PrimaryGeneratedColumn, Unique} from "typeorm";
import {GameCharacter}                                  from "../../../../lib/entities/game-character";

@Entity()
@Unique('name', ['name'])
export class Character implements GameCharacter {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    accountId: number;

    @Column()
    name: string;

    @Column()
    gender: 'male' | 'female' = 'male';
}
