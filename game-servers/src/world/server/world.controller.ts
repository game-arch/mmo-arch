import {Controller, Get, Logger}                     from '@nestjs/common';
import {WorldGateway}                                from "./world.gateway";
import {EventPattern}                                from "@nestjs/microservices";
import {CharacterLoggedIn, CharacterLoggedOut}       from "../../global/character/actions";
import {PresenceOnline}                              from "../../global/presence/actions";
import {WorldConstants}                              from "../constants";
import {AllPlayers, PlayerEnteredMap, PlayerLeftMap} from "../map/actions";

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
            this.gateway.loggedInCharacters[data.characterId] = {
                id  : data.characterId,
                name: data.name,
                map : ''
            };
            this.logger.log(data.name + ' is online.');
            this.gateway.server.emit(CharacterLoggedIn.event, data);
        }
    }

    @EventPattern(CharacterLoggedOut.event)
    onCharacterLeave(data: CharacterLoggedOut) {
        if (data.world === WorldConstants.CONSTANT) {
            delete this.gateway.loggedInCharacters[data.characterId];
            this.logger.log(data.name + ' is offline.');
            this.gateway.server.emit(CharacterLoggedOut.event, data);
        }
    }

    @EventPattern(PlayerEnteredMap.event)
    onMapJoined(data: PlayerEnteredMap) {
        if (data.world === WorldConstants.CONSTANT) {
            console.log('player joined', data);
            this.gateway.playerJoin(data.characterId, data.map, data.x, data.y);
        }
    }

    @EventPattern(PlayerLeftMap.event)
    onMapLeft(data: PlayerLeftMap) {
        if (data.world === WorldConstants.CONSTANT) {
            console.log('player left', data);
            this.gateway.playerLeave(data.characterId, data.map);
        }
    }

    @EventPattern(AllPlayers.event)
    onAllPlayers(data: AllPlayers) {
        console.log('all players', data);
        if (data.world === WorldConstants.CONSTANT) {
            this.gateway.server.to('map.' + data.map).emit(AllPlayers.event, data.players);
        }
    }
}
