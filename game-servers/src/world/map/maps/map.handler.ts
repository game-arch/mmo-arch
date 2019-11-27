import {MapConfig}               from "../config/config";
import {Player}                  from "../entities/player";
import {from, interval, Subject} from "rxjs";
import {map, takeUntil, toArray} from "rxjs/operators";
import {PlayerDirectionalInput}  from "../actions";
import Scene = Phaser.Scene;
import {loadCollisions}          from "../phaser/collisions";
import Group = Phaser.Physics.Arcade.Group;


export class MapHandler extends Scene {
    constant: string;
    name: string;

    stop$ = new Subject();

    players: { [characterId: number]: Player } = {};
    emitter                                    = new Subject();

    collisionGroup: Group;

    savePlayer = new Subject<Player>();

    constructor(public config: MapConfig) {
        super({
            key: config.name
        });
    }

    create() {
        this.collisionGroup = loadCollisions(this.config, this);
    }

    update(time: number, delta: number) {
        this.emitter.next();
    }


    addPlayer(player: Player) {
        this.players[player.characterId] = player;
        this.players[player.characterId].init(this, player._x, player._y);
        this.physics.add.collider(player.graphics, this.collisionGroup);
        player.onStopMoving.pipe(takeUntil(player.stopListening))
              .subscribe(() => this.savePlayer.next(player));
    }

    removePlayer(player: Player) {
        if (this.players[player.characterId]) {
            this.players[player.characterId].stopListening.next();
            this.players[player.characterId].graphics.destroy(true);
            delete this.players[player.characterId];
        }
    }

    async getAllPlayers() {
        return await from(Object.keys(this.players)).pipe(
            map(key => this.players[key].asPayload()),
            toArray()
        ).toPromise();
    }

    movePlayer(data: PlayerDirectionalInput) {
        let player = this.players[data.characterId];
        if (player) {
            player.moving = {
                up   : !!data.directions.up,
                down : !!data.directions.down,
                left : !!data.directions.left,
                right: !!data.directions.right
            }
        }
    }
}
