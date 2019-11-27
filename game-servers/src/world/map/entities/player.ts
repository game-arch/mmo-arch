import {Column, Entity, Index, PrimaryGeneratedColumn, Unique} from "typeorm";
import {Body, Circle}                                          from "p2";
import {Subject}                                               from "rxjs";
import {Physics}                                               from "../config/physics";

@Entity()
@Index('map', ['map'])
@Index('location', ['map', 'x', 'y'])
@Unique('character', ['characterId'])
export class Player {

    stopListening = new Subject();
    onStartMoving = new Subject();
    onStopMoving  = new Subject();

    get moving(): { left: boolean; up: boolean; right: boolean; down: boolean } {
        return this._moving;
    }

    set moving(value: { left: boolean; up: boolean; right: boolean; down: boolean }) {
        this._moving         = value;
        let previousVelocity = this.body.velocity;

        let velocity: [number, number] = [0, 0];
        let speed                      = Physics.SERVER_SPEED_BASE * Physics.SPEED_MODIFIER;
        if (value.up) {
            velocity[1] = -speed;
        } else if (value.down) {
            velocity[1] = speed;
        }
        if (value.left) {
            velocity[0] = -speed;
        } else if (value.right) {
            velocity[0] = speed;
        }
        this.body.velocity = velocity;
        console.log(previousVelocity, velocity);
        if (previousVelocity[0] === 0 && previousVelocity[1] === 0 && (velocity[0] !== 0 || velocity[1] !== 0)) {
            console.log('start moving');
            this.onStartMoving.next();
        }
        if (velocity[0] === 0 && velocity[1] === 0 && (previousVelocity[0] !== 0 || previousVelocity[1] !== 0)) {
            console.log('stop moving');
            this.onStopMoving.next();
        }
    }

    @Column()
    get y(): number {
        return this.body.position[1];
    }

    set y(value: number) {
        this.body.position[1] = value;
    }

    @Column()
    get x(): number {
        return this.body.position[0];
    }

    set x(value: number) {
        this.body.position[0] = value;
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    world: string;
    @Column()
    characterId: number;
    @Column()
    map: string;
    @Column()
    name: string;

    body: Body;

    private _moving = {
        up   : false,
        down : false,
        left : false,
        right: false
    };

    constructor() {

        this.body      = new Body({mass: 1, gravityScale: 0, position: [0, 0]});
        this.body.type = Body.KINEMATIC;
        this.body.updateMassProperties();
        this.body.addShape(new Circle({
            radius: 16
        }));
    }

    asPayload() {
        return {
            characterId: this.characterId,
            name       : this.name,
            x          : this.body.position[0],
            y          : this.body.position[1],
            moving     : this._moving
        }
    }
}
