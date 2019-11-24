import {UserPresence}                       from "./services/user.presence";
import {Controller, OnApplicationBootstrap} from "@nestjs/common";
import {Events}                             from "../../../lib/constants/events";
import {EventPattern, MessagePattern}       from "@nestjs/microservices";
import {interval}                           from "rxjs";
import {first}                              from "rxjs/operators";
import {ServerPresence}                     from "./services/server.presence";
import {CharacterPresence}                  from "./services/character.presence";
import {PresenceEmitter}                    from "./emitter/presence.emitter";

@Controller()
export class PresenceController implements OnApplicationBootstrap {
    constructor(
        private user: UserPresence,
        private server: ServerPresence,
        private character: CharacterPresence,
        private emitter: PresenceEmitter
    ) {
    }

    @MessagePattern(Events.SERVER_LIST)
    async getServers() {
        return await this.server.getServers();
    }

    @MessagePattern(Events.REGISTER_SERVER)
    async register({name, port, instanceId, host}: { name: string, port: number, instanceId: number, host: string }) {
        return await this.server.register(this.server.getHost(host), port, instanceId, name);
    }

    @EventPattern(Events.USER_CONNECTED)
    async userConnected({serverId, accountId}: { serverId: number, accountId: number }) {
        await this.user.online(serverId, accountId);
    }

    @EventPattern(Events.USER_DISCONNECTED)
    async userDisconnected({serverId, accountId}: { accountId: number, serverId: number }) {
        await this.character.offline(accountId);
        await this.user.offline(serverId, accountId);
    }

    @EventPattern(Events.CHARACTER_ONLINE)
    async characterOnline({accountId, name}: { accountId: number, name: string }) {
        await this.character.online(accountId, name);
    }

    @EventPattern(Events.CHARACTER_OFFLINE)
    async characterOffline({accountId}: { accountId: number }) {
        await this.character.offline(accountId);
    }

    @EventPattern(Events.SERVER_OFFLINE)
    async serverOffline({serverId}: { serverId: number }) {
        await this.server.offline(serverId);
    }

    onApplicationBootstrap() {
        this.emitter.nowOnline();
    }


}
