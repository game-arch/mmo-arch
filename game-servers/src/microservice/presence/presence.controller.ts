import {PresenceService}                    from "./presence.service";
import {Controller, OnApplicationBootstrap} from "@nestjs/common";
import {Events}                             from "../../../lib/constants/events";
import {MessagePattern}                     from "@nestjs/microservices";
import {interval}                           from "rxjs";
import {first, mergeMap}                    from "rxjs/operators";
import {fromPromise}                        from "rxjs/internal-compatibility";

@Controller()
export class PresenceController implements OnApplicationBootstrap {
    constructor(private service: PresenceService) {
    }

    @MessagePattern(Events.SERVER_LIST)
    async getServers() {
        return await this.service.getServers();
    }

    @MessagePattern(Events.REGISTER_SERVER)
    async register({name, port, instanceId, host}: { name: string, port: number, instanceId: number, host: string }) {
        return await this.service.register(this.service.getHost(host), port, instanceId, name);
    }

    @MessagePattern(Events.USER_CONNECTED)
    async userConnected({serverId, accountId}: { serverId: number, accountId: number }) {
        return await this.service.addUser(serverId, accountId);
    }

    @MessagePattern(Events.USER_DISCONNECTED)
    async userDisconnected({serverId, accountId}: { accountId: number, serverId: number }) {
        return await this.service.removeUser(serverId, accountId);
    }

    @MessagePattern(Events.CHARACTER_ONLINE)
    async characterOnline({accountId, name}: { accountId: number, name: string }) {
        return await this.service.characterJoin(accountId, name);
    }

    @MessagePattern(Events.CHARACTER_OFFLINE)
    async characterOffline({accountId}: { accountId: number }) {
        return await this.service.characterLeave(accountId);
    }

    onApplicationBootstrap() {
        this.healthCheck().then();
    }

    async healthCheck() {
        await this.service.healthCheck();
        await interval(10000).pipe(first()).toPromise();
        await this.healthCheck();
    }


}
