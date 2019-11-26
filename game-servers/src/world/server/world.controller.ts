import {Controller, Get, Logger}               from '@nestjs/common';
import {WorldGateway}                          from "./world.gateway";
import {EventPattern}                          from "@nestjs/microservices";
import {CharacterLoggedIn, CharacterLoggedOut} from "../../global/character/actions";
import {PresenceOnline}                        from "../../global/presence/actions";
import {WorldConstants}                        from "../constants";
import {PlayerEnteredMap, PlayerLeftMap}       from "../map/actions";

@Controller()
export class WorldController {


    constructor(
        private logger: Logger,
        private gateway: WorldGateway
    ) {

    }

    @Get('health')
    health() {
        return "OK";
    }

    @Get('connections')
    async userCount() {
        return Object.keys(this.gateway.accounts).map(key => this.gateway.accounts[key]);
    }

    @EventPattern(PresenceOnline.event)
    async onPresenceOnline() {
        await this.gateway.afterInit(this.gateway.server);
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

    @EventPattern(PlayerEnteredMap.event)
    onMapJoined(data: PlayerEnteredMap) {
        if (data.world === WorldConstants.CONSTANT) {
            if (this.gateway.characters.hasOwnProperty(data.characterId)) {
                this.gateway.characters[data.characterId].socket.join('map.' + data.map);
                this.gateway.server.to('map.' + data.map).emit(PlayerEnteredMap.event, {
                    ...this.gateway.characters[data.characterId].character,
                    x: data.x,
                    y: data.y
                });
            }
        }
    }

    @EventPattern(PlayerLeftMap.event)
    onMapLeft(data: PlayerLeftMap) {
        if (data.world === WorldConstants.CONSTANT) {
            if (this.gateway.characters.hasOwnProperty(data.characterId)) {
                this.gateway.characters[data.characterId].socket.leave('map.' + data.map);
                this.gateway.server.to('map.' + data.map).emit(PlayerLeftMap.event, this.gateway.characters[data.characterId].character);
            }
        }
    }
}
