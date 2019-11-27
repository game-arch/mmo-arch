import {Column, Entity, Index, PrimaryGeneratedColumn, Unique} from "typeorm";
import {Body, Circle}                                          from "p2";

@Entity()
@Index('map', ['map'])
@Index('location', ['map', 'x', 'y'])
@Unique('character', ['characterId'])
export class Player {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    world: string;
    @Column()
    characterId: number;
    @Column()
    map: string;
    @Column()
    x: number;
    @Column()
    y: number;
    @Column()
    name:string;

    body: Body;

    constructor() {

        this.body = new Body({mass: 0, position: [0, 0]});
        this.body.addShape(new Circle({
            radius: 16
        }));
    }
}
