import {Controller, Logger}                    from '@nestjs/common';
import {EventPattern}                          from "@nestjs/microservices";
import {CharacterLoggedIn, CharacterLoggedOut} from "../../character/actions";
import {CharacterGateway}                      from "./character.gateway";
import {MapOnline}                             from "../../map/actions";
import {WORLD_PREFIX}                          from "../world.prefix";
import {MapClient}                             from "../../map/client/map.client";

@Controller()
export class CharacterController {


    constructor(
        private logger: Logger,
        private gateway: CharacterGateway,
        private map: MapClient
    ) {

    }

    @EventPattern(WORLD_PREFIX + MapOnline.event)
    async onMapOnline() {
        await this.gateway.sendCharacters();
    }

    @EventPattern(WORLD_PREFIX + CharacterLoggedIn.event)
    onCharacterJoin(data: CharacterLoggedIn) {
        this.logger.log(data.name + ' is online.');
        this.map.characterLoggedIn(data.characterId, data.gender, data.world, data.name);
        this.gateway.server.emit(CharacterLoggedIn.event, data);
    }

    @EventPattern(WORLD_PREFIX + CharacterLoggedOut.event)
    onCharacterLeave(data: CharacterLoggedOut) {
        this.logger.log(data.name + ' is offline.');
        this.map.characterLoggedOut(data.characterId, data.name, data.world);
        this.gateway.server.emit(CharacterLoggedOut.event, data);
    }
}
