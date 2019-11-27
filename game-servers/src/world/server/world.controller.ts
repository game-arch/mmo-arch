import {Controller, Get, Logger}                                from '@nestjs/common';
import {WorldGateway}                                           from "./world.gateway";
import {EventPattern}                                           from "@nestjs/microservices";
import {CharacterLoggedIn, CharacterLoggedOut}                  from "../../global/character/actions";
import {PresenceOnline}                                         from "../../global/presence/actions";
import {WorldConstants}                                         from "../constants";
import {AllPlayers, MapOnline, PlayerEnteredMap, PlayerLeftMap} from "../map/actions";
import {WorldService}                                           from "./world.service";

@Controller()
export class WorldController {


    constructor(
        private logger: Logger,
        private service: WorldService,
        private gateway: WorldGateway
    ) {

    }

    @Get('health')
    health() {
        return "OK";
    }

    @Get('connections')
    async userCount() {
        return Object.keys(this.service.accounts).map(key => {
            let player = this.service.accounts[key];

            return {
                accountId: player.accountId,
                socketId : player.socket.id,
                character: player.character
            }
        });
    }

    @EventPattern(PresenceOnline.event)
    async onPresenceOnline() {
        await this.gateway.afterInit(this.gateway.server);
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
