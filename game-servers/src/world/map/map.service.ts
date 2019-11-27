import {Inject, Injectable, Type}                                   from '@nestjs/common';
import {MapConstants}                                               from "./constants";
import {MapHandler}                                                 from "./maps/map.handler";
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

@Injectable()
export class MapService {


    constructor(
        private emitter: MapEmitter,
        private character: CharacterClient,
        @Inject(MapConstants.MAP) public map: MapHandler,
        @InjectRepository(Player) private playerRepo: Repository<Player>
    ) {

    }


    start() {
        this.map.start();
        this.map.savePlayer.pipe(takeUntil(this.map.stop$))
            .subscribe(async player => {
                if (player) {
                    console.log('save player!');
                    await this.playerRepo.save(player);
                }
            });
        this.map.emitter.pipe(takeUntil(this.map.stop$))
            .pipe(concatMap(() => fromPromise(this.map.getAllPlayers())))
            .pipe(throttleTime(300, async, {leading: true, trailing: true}))
            .subscribe((players) => {
                this.emitter.allPlayers(WorldConstants.CONSTANT, this.map.constant, players);
            });
    }

    stop() {
        this.map.stop();
    }

    async changeMap(characterId: number, world: string, map: string, newX: number, newY: number) {
        if (map === this.map.constant) {
            let player  = await this.playerRepo.findOne({characterId});
            let lastMap = player.map + '';
            player.map  = map;
            player.x    = newX;
            player.y    = newY;
            await this.playerRepo.save(player);
            this.emitter.playerLeftMap(characterId, world, player.name, lastMap);
            this.emitter.playerJoinedMap(characterId, world, player.name, player.map, player.x, player.y);
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
            this.emitter.playerJoinedMap(characterId, world, name, player.map, player.x, player.y);
            this.map.addPlayer(player);
            this.emitter.allPlayers(world, player.map, await this.map.getAllPlayers());
        }
    }

    async playerLeftMap(characterId: number, world: string) {
        let player = await this.playerRepo.findOne({characterId});
        if (player) {
            this.emitter.playerLeftMap(characterId, world, player.name, player.map);
            this.map.removePlayer(player);
            this.emitter.allPlayers(world, player.map, await this.map.getAllPlayers());
        }

    }

    movePlayer(data: PlayerDirectionalInput) {
        if (this.map.players[data.characterId]) {
            this.map.movePlayer(data);
        }
    }

}
