import {Controller, Get, OnApplicationBootstrap, OnApplicationShutdown, Req, Res} from '@nestjs/common';
import {MapService}                                                               from './map.service';
import {EventPattern, MessagePattern}                                             from "@nestjs/microservices";
import {CharacterCreated, CharacterLoggedIn, CharacterLoggedOut}                  from "../../global/character/actions";
import {GetAllPlayers, PlayerChangedMap, PlayerMoved}                             from "./actions";
import {Request, Response}                                                        from "express";
import {MapEmitter}                                                               from "./map.emitter";

@Controller()
export class MapController implements OnApplicationBootstrap, OnApplicationShutdown {
    constructor(
        private readonly emitter: MapEmitter,
        private readonly service: MapService
    ) {
    }

    @Get('players')
    async getPlayers(@Req() request: Request, @Res() response: Response) {
        return await this.service.map.getAllPlayers();
    }

    @MessagePattern(GetAllPlayers.event)
    async getAllPlayers(data: GetAllPlayers) {
        return await this.service.map.getAllPlayers();
    }

    @EventPattern(CharacterCreated.event)
    characterCreated(data: CharacterCreated) {
        console.log(data);
    }

    @EventPattern(PlayerChangedMap.event)
    async changedMap(data: PlayerChangedMap) {
        await this.service.changeMap(data.characterId, data.world, data.map, data.newX, data.newY);
    }

    @EventPattern(CharacterLoggedIn.event)
    async characterLoggedIn(data: CharacterLoggedIn) {
        await this.service.playerJoinedMap(data.characterId, data.name, data.world);
    }

    @EventPattern(CharacterLoggedOut.event)
    async characterLoggedOut(data: CharacterLoggedOut) {
        await this.service.playerLeftMap(data.characterId, data.world);
    }

    @EventPattern(PlayerMoved.event)
    async playerMoved(data: PlayerMoved) {
        if (data.map === this.service.map.constant) {
            if (this.service.map.players[data.characterId]) {
                this.service.map.movePlayer(data);
            }
        }
    }

    onApplicationBootstrap() {
        this.service.start();
        this.emitter.nowOnline();
    }

    onApplicationShutdown(signal?: string) {
        this.service.stop();
    }
}
