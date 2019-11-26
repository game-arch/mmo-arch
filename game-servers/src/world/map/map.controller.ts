import {Controller, Get, OnApplicationBootstrap, OnApplicationShutdown} from '@nestjs/common';
import {MapService}                                                     from './map.service';
import {EventPattern}                                                   from "@nestjs/microservices";
import {CharacterCreated, CharacterLoggedIn, CharacterLoggedOut}        from "../../global/character/actions";

@Controller()
export class MapController implements OnApplicationBootstrap, OnApplicationShutdown {
    constructor(private readonly service: MapService) {
    }


    @EventPattern(CharacterCreated.event)
    characterCreated(data: CharacterCreated) {
        console.log(data);
    }

    @EventPattern(CharacterLoggedIn.event)
    async characterLoggedIn(data: CharacterLoggedIn) {
        await this.service.playerJoinedMap(data.characterId, data.world);
    }

    @EventPattern(CharacterLoggedOut.event)
    async characterLoggedOut(data) {
        await this.service.playerLeftMap(data.characterId, data.world);
    }

    onApplicationBootstrap() {
        this.service.start();
    }

    onApplicationShutdown(signal?: string) {
        this.service.stop();
    }
}
