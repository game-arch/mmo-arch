import {MapConfig}              from "../config/config";
import {from, Subject}          from "rxjs";
import {map, toArray}           from "rxjs/operators";
import {PlayerDirectionalInput} from "../actions";
import Scene = Phaser.Scene;
import {loadCollisions}         from "../../../../lib/phaser/collisions";
import Group = Phaser.Physics.Arcade.Group;
import {Mob}                    from "../../../../lib/phaser/mob";


export class BaseScene extends Scene implements Scene {
    constant: string;
    name: string;
    emitter = new Subject();

    entities: {
        player: { [characterId: number]: Mob },
        mob: { [mobId: number]: Mob }
    } = {player: {}, mob: {}};
    collisionGroups: { overlaps: Group, colliders: Group };

    constructor(public config: MapConfig) {
        super({
            key: config.name
        });
    }

    create() {
        this.physics.world.TILE_BIAS = 40;
        this.collisionGroups         = loadCollisions(this.config, this);
    }

    update(time: number, delta: number) {
        this.emitter.next();
    }


    addEntity(type: 'player' | 'mob', mob: Mob, id: number) {
        this.entities[type]     = this.entities[type] || {};
        this.entities[type][id] = mob;
        this.entities[type][id].create(this, mob.x, mob.y);
        this.physics.add.collider(mob.sprite, this.collisionGroups.colliders);
        this.physics.add.overlap(mob.sprite, this.collisionGroups.overlaps);
    }

    removeEntity(type: 'player' | 'mob', id: number) {
        if (this.entities[type][id]) {
            this.entities[type][id].sprite.stopListening.next();
            this.entities[type][id].destroy();
            delete this.entities[type][id];
        }
    }

    async getAllPlayers() {
        return await from(Object.keys(this.entities.player)).pipe(
            map(key => this.entities.player[key].asPayload()),
            toArray()
        ).toPromise();
    }
}
