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
    characterLoggedIn(data) {
        console.log('logged in', data);
    }

    @EventPattern(CharacterLoggedOut.event)
    characterLoggedOut(data) {
        console.log('logged out', data);

    }

    onApplicationBootstrap() {
        this.service.start();
    }

    onApplicationShutdown(signal?: string) {
        this.service.stop();
    }
}
