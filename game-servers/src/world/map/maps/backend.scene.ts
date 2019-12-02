import {MapConfig}                    from "../config/config";
import {Player}                       from "../entities/player";
import {Subject}                      from "rxjs";
import {takeUntil, tap, throttleTime} from "rxjs/operators";
import {loadCollisions}               from "../../../../lib/phaser/collisions";
import {BaseScene}                    from "./base.scene";
import Scene = Phaser.Scene;
import {Mob}                          from "../../../../lib/phaser/mob";
import {PlayerDirectionalInput}       from "../actions";
import {async}                        from "rxjs/internal/scheduler/async";


export class BackendScene extends BaseScene implements Scene {
    constant: string;
    name: string;
    stop$ = new Subject();

    entities: {
        player: { [characterId: number]: Player },
        mob: { [mobId: number]: Mob }
    };
    savePlayer = new Subject<Player>();

    constructor(public config: MapConfig) {
        super(config);
    }

    create() {
        this.physics.world.TILE_BIAS = 40;
        this.collisionGroups         = loadCollisions(this.config, this);
    }


    addPlayer(player: Player) {
        this.addEntity('player', player, player.characterId);
        player.sprite.onStopMoving.pipe(takeUntil(player.sprite.stopListening))
              .pipe(takeUntil(this.stop$))
              .pipe(throttleTime(1000, async, {trailing: true, leading: true}))
              .subscribe(() => this.savePlayer.next(player));

    }

    removePlayer(player: Player) {
        this.removeEntity('player', player.characterId);
    }

    movePlayer(data: PlayerDirectionalInput) {
        let player = this.entities.player[data.characterId];
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
