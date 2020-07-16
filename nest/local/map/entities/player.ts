import { Column, Entity, Index, PrimaryColumn, Unique } from 'typeorm'
import { Mob }                                          from '../../../../shared/phaser/mob'

@Entity()
@Index('playerMap', ['map'])
@Index('playerLocation', ['map', 'x', 'y'])
@Unique('playerCharacter', ['id'])
export class Player implements Mob {
    velX            = 0
    velY            = 0
    @PrimaryColumn()
    id: number
    @Column()
    channel: number
    @Column()
    map: string
    @Column()
    name: string
    @Column()
    online: boolean = false


    get instanceId() {
        return this.id
    }

    get mobId() {
        return this.id
    }

    _x = 0

    @Column('int', { nullable: true })
    get x(): number {
        return Math.floor(this._x)
    }

    set x(value: number) {
        this._x = value
    }

    _y = 0

    @Column('int', { nullable: true })
    get y(): number {
        return Math.floor(this._y)
    }

    set y(value: number) {
        this._y = value
    }
}
