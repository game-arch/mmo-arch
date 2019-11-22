import {UserPresence}                       from "./user.presence";
import {Controller, OnApplicationBootstrap} from "@nestjs/common";
import {Events}                             from "../../../lib/constants/events";
import {MessagePattern}                     from "@nestjs/microservices";
import {interval}                           from "rxjs";
import {first}                              from "rxjs/operators";
import {ServerPresence}                     from "./server.presence";
import {CharacterPresence}                  from "./character.presence";

@Controller()
export class PresenceController implements OnApplicationBootstrap {
    constructor(
        private user: UserPresence,
        private server: ServerPresence,
        private character: CharacterPresence
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

    @MessagePattern(Events.USER_CONNECTED)
    async userConnected({serverId, accountId}: { serverId: number, accountId: number }) {
        return await this.user.online(serverId, accountId);
    }

    @MessagePattern(Events.USER_DISCONNECTED)
    async userDisconnected({serverId, accountId}: { accountId: number, serverId: number }) {
        let character = await this.character.offline(accountId);
        await this.user.offline(serverId, accountId);
        return {character};
    }

    @MessagePattern(Events.CHARACTER_ONLINE)
    async characterOnline({accountId, name}: { accountId: number, name: string }) {
        return await this.character.online(accountId, name);
    }

    @MessagePattern(Events.CHARACTER_OFFLINE)
    async characterOffline({accountId}: { accountId: number }) {
        return {character: await this.character.offline(accountId)};
    }

    onApplicationBootstrap() {
        this.healthCheck().then();
    }

    async healthCheck() {
        await this.server.healthCheck();
        await interval(10000).pipe(first()).toPromise();
        await this.healthCheck();
    }


}
