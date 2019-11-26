import {Inject, Injectable, Type} from '@nestjs/common';
import {MapConstants}             from "./constants";
import {MapHandler}               from "./maps/map.handler";
import {Repository}               from "typeorm";
import {Player}                   from "./entities/player";
import {InjectRepository}         from "@nestjs/typeorm";
import {MapEmitter}               from "./map.emitter";

@Injectable()
export class MapService {


    constructor(
        private emitter: MapEmitter,
        @Inject(MapConstants.MAP) private map: MapHandler,
        @InjectRepository(Player) private playerRepo: Repository<Player>
    ) {

    }


    start() {
        this.map.start();
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
            this.emitter.playerLeftMap(characterId, world, lastMap);
            this.emitter.playerJoinedMap(characterId, world, player.map, player.x, player.y);
        }
    }

    async playerJoinedMap(characterId: number, world: string) {
        let player = await this.playerRepo.findOne({characterId});
        if (!player && this.map.constant === 'tutorial') {
            player = this.playerRepo.create({characterId, world, map: this.map.name, x: 100, y: 100});
            await this.playerRepo.save(player);
        }
        if (player) {
            this.emitter.playerJoinedMap(characterId, world, player.map, player.x, player.y);
            this.map.addPlayer(player);
            this.emitter.allPlayers(world, player.map, await this.map.getAllPlayers());
        }
    }

    async playerLeftMap(characterId: number, world: string) {
        let player = await this.playerRepo.findOne({characterId, world, map: this.map.constant});
        if (player) {
            this.emitter.playerLeftMap(characterId, world, player.map);
            this.map.removePlayer(player);
            this.emitter.allPlayers(world, player.map, await this.map.getAllPlayers());
        }

    }

}
