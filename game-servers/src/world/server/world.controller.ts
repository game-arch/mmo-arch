import {Controller, Get, Logger} from '@nestjs/common';
import {WorldGateway}            from "./world.gateway";
import {EventPattern}            from "@nestjs/microservices";
import {Events}                  from "../../../lib/constants/events";
import {WorldConstants}          from "../constants";

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

    @EventPattern(Events.CHARACTER_ONLINE + '.' + WorldConstants.CONSTANT)
    onCharacterJoin(data: { accountId: number, serverId: number, characterName: string }) {
        this.logger.log('Character ' + data.characterName + ' is online.');
        this.gateway.server.emit(Events.CHARACTER_ONLINE, data);
    }

    @EventPattern(Events.CHARACTER_OFFLINE + '.' + WorldConstants.CONSTANT)
    onCharacterLeave(data: { accountId: number, serverId: number, characterName: string }) {
        this.logger.log('Character ' + data.characterName + ' is offline.');
        this.gateway.server.emit(Events.CHARACTER_OFFLINE, data);
    }
}
