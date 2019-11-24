import {Controller, Get, OnApplicationBootstrap, OnApplicationShutdown} from '@nestjs/common';
import {MapService}                                                     from './map.service';
import {EventPattern}                                                   from "@nestjs/microservices";
import {Events}                                                         from "../../../lib/constants/events";

@Controller()
export class MapController implements OnApplicationBootstrap, OnApplicationShutdown {
    constructor(private readonly service: MapService) {
    }


    @EventPattern(Events.CHARACTER_CREATED)
    characterCreated(data: { characterId: number, accountId: number, world: string }) {
        console.log(data);
    }

    @EventPattern(Events.CHARACTER_ONLINE)
    characterOnline(data) {

    }

    @EventPattern(Events.CHARACTER_OFFLINE)
    characterOffline(data) {

    }

    onApplicationBootstrap() {
        this.service.start();
    }

    onApplicationShutdown(signal?: string) {
        this.service.stop();
    }
}
