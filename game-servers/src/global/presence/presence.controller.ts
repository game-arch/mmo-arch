import {Controller, OnApplicationBootstrap} from "@nestjs/common";
import {Events}                             from "../../../lib/constants/events";
import {EventPattern, MessagePattern}       from "@nestjs/microservices";
import {ServerPresence}                     from "./services/server.presence";
import {PresenceEmitter}                    from "./emitter/presence.emitter";

@Controller()
export class PresenceController implements OnApplicationBootstrap {
    constructor(
        private server: ServerPresence,
        private emitter: PresenceEmitter
    ) {
    }

    @MessagePattern(Events.SERVER_LIST)
    async getServers() {
        return await this.server.getServers();
    }

    @MessagePattern(Events.REGISTER_SERVER)
    async register({constant, name, port, instanceId, host}: { constant: string, name: string, port: number, instanceId: number, host: string }) {
        return await this.server.register(this.server.getHost(host), port, instanceId, constant, name);
    }

    @EventPattern(Events.SERVER_OFFLINE)
    async serverOffline({serverId}: { serverId: number }) {
        await this.server.offline(serverId);
    }

    async onApplicationBootstrap() {
        this.emitter.nowOnline();
    }


}
