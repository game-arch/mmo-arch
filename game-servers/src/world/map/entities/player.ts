import {Column, Entity, Index, PrimaryGeneratedColumn, Unique} from "typeorm";
import {PlayerSprite}                                          from "../phaser/playerSprite";
import Body = Phaser.Physics.Arcade.Body;

@Entity()
@Index('map', ['map'])
@Index('location', ['map', 'x', 'y'])
@Unique('character', ['characterId'])
export class Player extends PlayerSprite {

    _x: number;
    _y: number;
    @Column()
    get y(): number {
        if (this.body) {
            return this.body.position.y;
        }
        return this._y;
    }

    set y(value: number) {
        this._y = value;
        if (this.body) {
            this.body.position.y = value;
        }
    }

    @Column()
    get x(): number {
        if (this.body) {
            return this.body.position.x;
        }
        return this._x;
    }

    set x(value: number) {
        this._x = value;
        if (this.body) {
            this.body.position.x = value;
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

    body: Body;

    asPayload() {
        return {
            characterId: this.characterId,
            name       : this.name,
            x          : this.body.position.x,
            y          : this.body.position.y,
            moving     : this._moving
        }
    }
}
