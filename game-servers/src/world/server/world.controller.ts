import {Controller, Get, Logger}           from '@nestjs/common';
import {WorldGateway}                      from "./world.gateway";
import {EventPattern}                      from "@nestjs/microservices";
import {Events}                            from "../../../lib/constants/events";
import {WorldConstants}                    from "../constants";
import {CharacterOffline, CharacterOnline} from "../../../lib/actions";

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

    @EventPattern(Events.PRESENCE_ONLINE)
    async onPresenceOnline() {
        await this.gateway.afterInit(this.gateway.server);
    }

    @EventPattern(CharacterOnline.event)
    onCharacterJoin(data: CharacterOnline) {
        this.logger.log(data.name + ' is online.');
        this.gateway.server.emit(CharacterOnline.event, data);
    }

    @EventPattern(CharacterOffline.event)
    onCharacterLeave(data: CharacterOffline) {
        this.logger.log(data.name + ' is offline.');
        this.gateway.server.emit(CharacterOffline.event, data);
    }
}
