import {Controller, Logger}                    from '@nestjs/common';
import {EventPattern}                          from "@nestjs/microservices";
import {CharacterLoggedIn, CharacterLoggedOut} from "../../global/character/actions";
import {WorldConstants}                        from "../constants";
import {CharacterGateway}                      from "./character.gateway";
import {MapOnline}                             from "../map/actions";

@Controller()
export class CharacterController {


    constructor(
        private logger: Logger,
        private gateway: CharacterGateway
    ) {

    }

    @EventPattern(MapOnline.event)
    async onMapOnline() {
        await this.gateway.sendCharacters();
    }

    @EventPattern(CharacterLoggedIn.event)
    onCharacterJoin(data: CharacterLoggedIn) {
        if (data.world === WorldConstants.CONSTANT) {
            this.logger.log(data.name + ' is online.');
            this.gateway.server.emit(CharacterLoggedIn.event, data);
        }
    }

    @EventPattern(CharacterLoggedOut.event)
    onCharacterLeave(data: CharacterLoggedOut) {
        if (data.world === WorldConstants.CONSTANT) {
            this.logger.log(data.name + ' is offline.');
            this.gateway.server.emit(CharacterLoggedOut.event, data);
        }
    }
}
