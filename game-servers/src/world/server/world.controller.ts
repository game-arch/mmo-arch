import {Controller, Get, Logger}               from '@nestjs/common';
import {WorldGateway}                          from "./world.gateway";
import {EventPattern}                          from "@nestjs/microservices";
import {CharacterLoggedIn, CharacterLoggedOut} from "../../global/character/actions";
import {PresenceOnline}                        from "../../global/presence/actions";

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
        this.logger.log(data.name + ' is online.');
        this.gateway.server.emit(CharacterLoggedIn.event, data);
    }

    @EventPattern(CharacterLoggedOut.event)
    onCharacterLeave(data: CharacterLoggedOut) {
        this.logger.log(data.name + ' is offline.');
        this.gateway.server.emit(CharacterLoggedOut.event, data);
    }
}
