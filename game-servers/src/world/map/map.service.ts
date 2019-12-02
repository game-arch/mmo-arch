import {Inject, Injectable, Type}                                   from '@nestjs/common';
import {MapConstants}                                               from "./constants";
import {BaseScene}                                                  from "./maps/base.scene";
import {Repository}                                                 from "typeorm";
import {Player}                                                     from "./entities/player";
import {InjectRepository}                                           from "@nestjs/typeorm";
import {MapEmitter}                                                 from "./map.emitter";
import {CharacterClient}                                            from "../../global/character/client/character.client";
import {PlayerDirectionalInput}                                     from "./actions";
import {concatMap, map, mergeMap, takeUntil, throttleTime, toArray} from "rxjs/operators";
import {async}                                                      from "rxjs/internal/scheduler/async";
import {WorldConstants}                                             from "../constants";
import {fromPromise}                                                from "rxjs/internal-compatibility";
import {from, interval}                                             from "rxjs";
import {Game}                                                       from "phaser";
import {BackendScene}                                               from "./maps/backend.scene";

@Injectable()
export class MapService {

    phaser: Game;

    constructor(
        private emitter: MapEmitter,
        private character: CharacterClient,
        @Inject(MapConstants.MAP) public map: BackendScene,
        @InjectRepository(Player) private playerRepo: Repository<Player>
    ) {

        this.phaser = new Game({
            type   : Phaser.HEADLESS,
            width  : 1024,
            height : 768,
            banner : true,
            audio  : {
                noAudio: true
            },
            scene  : [this.map],
            physics: {
                default: 'arcade',
                arcade : {
                    gravity: {y: 0, x: 0}
                }
            }
        });

    }


    start() {
        this.phaser.scene.start(this.map.constant);
        this.map.savePlayer.pipe(takeUntil(this.map.stop$))
            .subscribe(async player => {
                if (player) {
                    await this.playerRepo.save(player);
                }
            });
        this.map.emitter.pipe(takeUntil(this.map.stop$))
            .pipe(throttleTime(1000, async, {leading: true}))
            .pipe(concatMap(() => fromPromise(this.map.getAllPlayers())))
            .pipe(throttleTime(1000, async, {leading: true, trailing: true}))
            .subscribe((players) => {
                this.emitter.allPlayers(WorldConstants.CONSTANT, this.map.constant, players);
            });
    }

    stop() {
        this.map.stop$.next();
        this.phaser.scene.stop(this.map.constant);
    }

    async changeMap(characterId: number, world: string, map: string, newX: number, newY: number) {
        if (map === this.map.constant) {
            let player  = await this.playerRepo.findOne({characterId});
            let lastMap = player.map + '';
            player.map  = map;
            player.x    = newX;
            player.y    = newY;
            await this.playerRepo.save(player);
            this.emitter.playerChangedMaps(world, lastMap, player.map, characterId, player.name, player.x, player.y);
        }
    }

    async playerJoinedMap(characterId: number, name: string, world: string) {
        let player = await this.playerRepo.findOne({characterId});
        if (!player && this.map.constant === 'tutorial') {
            player = this.playerRepo.create({characterId, world, map: 'tutorial', x: 100, y: 100});
        }
        if (player) {
            player.name = name;
            await this.playerRepo.save(player);
            this.map.addPlayer(player);
            this.emitter.playerJoinedMap(world, player.map, characterId, name, player.x, player.y);
        }
    }

    async playerLeftMap(characterId: number, world: string) {
        let player = await this.playerRepo.findOne({characterId});
        if (player) {
            this.map.removePlayer(player);
            this.emitter.playerLeftMap(world, player.map, characterId, player.name);
        }

    }

    movePlayer(data: PlayerDirectionalInput) {
        if (this.map.entities.player[data.characterId]) {
            this.map.movePlayer(data);
        }
    }

}
