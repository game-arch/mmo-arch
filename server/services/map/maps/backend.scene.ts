import {MapConfig}                                                         from "../config/config";
import {Player}                                                            from "../entities/player";
import {interval, merge, Subject}                                          from "rxjs";
import {distinct, distinctUntilChanged, map, takeUntil, tap, throttleTime} from "rxjs/operators";
import {loadCollisions}                                                    from "../../../lib/phaser/collisions";
import {BaseScene}                                                         from "./base.scene";
import Scene = Phaser.Scene;
import {Mob}                                                               from "../../../lib/phaser/mob";
import {async}                                                             from "rxjs/internal/scheduler/async";
import {Directions}                                                        from "../../../lib/phaser/directions";


export class BackendScene extends BaseScene implements Scene {
    constant: string;
    name: string;
    stop$ = new Subject();

    entities: {
        player: { [characterId: number]: Player },
        mob: { [mobId: number]: Mob }
    };
    savePlayer = new Subject<Player>();

    emitPlayer = new Subject<Player>();

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
              .subscribe(() => {
                  this.savePlayer.next(player);
              });
        player.sprite.onVelocityChange
              .pipe(takeUntil(this.stop$))
              .pipe(map(() => player))
              .pipe(distinctUntilChanged((a, b) => {
                  return a.asPayload() === b.asPayload()
              }))
              .subscribe(() => {
                  this.emitPlayer.next(player);
              });
    }

    removePlayer(player: Player) {
        this.removeEntity('player', player.characterId);
    }

    movePlayer(characterId: number, directions: Directions) {
        let player = this.entities.player[characterId];
        if (player) {
            player.moving = {
                up   : !!directions.up,
                down : !!directions.down,
                left : !!directions.left,
                right: !!directions.right
            };
        }
    }
}
