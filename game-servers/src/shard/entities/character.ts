import {Column, Entity, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Inventory}                                        from "./inventory";
import {GameCharacter}                                    from "../../../lib/entities/game-character";

@Entity()
export class Character implements GameCharacter {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    accountId: number;

    @Column()
    name: string;

    @Column()
    gender: 'male' | 'female' = 'male';

    @OneToOne(() => Inventory, i => i.character)
    inventory: Inventory;
}
