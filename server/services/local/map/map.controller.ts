import { Controller, Get, OnApplicationBootstrap, OnApplicationShutdown, Req, Res }   from "@nestjs/common";
import { MapService }                                                                 from "./map.service";
import { EventPattern, MessagePattern }                                               from "@nestjs/microservices";
import { CharacterLoggedIn, CharacterLoggedOut }                                      from "../character/actions";
import { GetAllPlayers, GetPlayerPosition, PlayerChangedMap, PlayerDirectionalInput } from "./actions";
import { Request, Response }                                                          from "express";
import { MapEmitter }                                                                 from "./map.emitter";
import { WorldConstants }                                                             from "../../../lib/constants/world.constants";
import { MapConstants }                                                               from "./constants";
import { WORLD_PREFIX }                                                               from "../world/world.prefix";
import { InjectRepository }                                                           from "@nestjs/typeorm";
import { Player }                                                                     from "./entities/player";
import { getConnection, Repository }                                                  from "typeorm";
import { from }                                                                       from "rxjs";
import { map, toArray }                                                               from "rxjs/operators";

@Controller()
export class MapController implements OnApplicationBootstrap, OnApplicationShutdown {
    constructor(
        private readonly emitter: MapEmitter,
        private readonly service: MapService,
        @InjectRepository(Player) private playerRepo: Repository<Player>
    ) {
    }

    @Get("players")
    getPlayers(@Req() request: Request, @Res() response: Response) {
        return this.service.map.getAllPlayers();
    }

    @MessagePattern(WORLD_PREFIX + GetAllPlayers.event)
    getAllPlayers(data: GetAllPlayers) {
        return this.service.map.getAllPlayers();
    }

    @EventPattern(WORLD_PREFIX + PlayerChangedMap.event)
    async changedMap(data: PlayerChangedMap) {
        await this.service.changedMaps(data.characterId, data.map, data.newX, data.newY);
    }

    @EventPattern(WORLD_PREFIX + CharacterLoggedIn.event)
    async characterLoggedIn(data: CharacterLoggedIn) {
        if (data.world === WorldConstants.CONSTANT) {
            await this.service.loggedIn(data.characterId, data.name);
        }
    }

    @EventPattern(WORLD_PREFIX + CharacterLoggedOut.event)
    async characterLoggedOut(data: CharacterLoggedOut) {
        if (data.world === WorldConstants.CONSTANT) {
            await this.service.loggedOut(data.characterId);
        }
    }

    @EventPattern(WORLD_PREFIX + PlayerDirectionalInput.event)
    async playerMoved(data: PlayerDirectionalInput) {
        if (data.map === this.service.map.constant) {
            this.service.movePlayer(data.characterId, data.directions);
        }
    }

    @MessagePattern(WORLD_PREFIX + GetPlayerPosition.event + "." + MapConstants.MAP)
    getPlayer(data: GetPlayerPosition) {
        return this.service.getPlayerPosition(data.characterId);
    }

    onApplicationBootstrap() {
        this.service.start();
        this.emitter.nowOnline();
    }

    async onApplicationShutdown(signal?: string) {
        this.service.stop();
        await getConnection().connect();
        let players = await from(Object.keys(this.service.map.entities.player))
            .pipe(map(key => this.service.map.entities.player[key]), toArray())
            .toPromise();
        await this.playerRepo.save(players);
        console.log("Saved Players!");
    }
}
