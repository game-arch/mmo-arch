import { Controller, OnApplicationBootstrap }        from '@nestjs/common'
import { EventPattern, MessagePattern }              from '@nestjs/microservices'
import { ServerPresence }                            from './services/server.presence'
import { PresenceEmitter }                           from './emitter/presence.emitter'
import { GetServers, RegisterServer, ServerOffline } from './actions'

@Controller()
export class PresenceController implements OnApplicationBootstrap {
    constructor(
        private server: ServerPresence,
        private emitter: PresenceEmitter
    ) {
    }

    @MessagePattern(GetServers.event)
    async getServers() {
        return await this.server.getServers()
    }

    @MessagePattern(RegisterServer.event)
    async register({ constant, name, port, instanceId, host }: RegisterServer) {
        return await this.server.register(this.server.getHost(host), port, instanceId, constant, name)
    }

    @EventPattern(ServerOffline.event)
    async serverOffline({ serverId }: ServerOffline) {
        await this.server.offline(serverId)
    }

    async onApplicationBootstrap() {
        this.emitter.nowOnline()
    }
}
