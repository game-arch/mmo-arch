import {Column, Entity, Index, PrimaryGeneratedColumn, Unique} from "typeorm";
import {Mob}                                                   from "../phaser/mob";

@Entity()
@Index('map', ['map'])
@Index('location', ['map', 'x', 'y'])
@Unique('character', ['characterId'])
export class Player extends Mob {

    _x: number;
    _y: number;
    @Column()
    get y(): number {
        if (this.sprite) {
            return this.sprite.body.position.y;
        }
        return this._y;
    }

    set y(value: number) {
        this._y = value;
        if (this.sprite) {
            this.sprite.body.position.y = value;
        }
    }

    @Column()
    get x(): number {
        if (this.sprite) {
            return this.sprite.body.position.x;
        }
        return this._x;
    }

    set x(value: number) {
        this._x = value;
        if (this.sprite) {
            this.sprite.body.position.x = value;
        }
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

    asPayload() {
        return {
            characterId: this.characterId,
            name       : this.name,
            x          : this.sprite.body.position.x,
            y          : this.sprite.body.position.y,
            moving     : this.sprite.moving
        }
    }
}
