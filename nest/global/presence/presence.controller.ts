import { Controller, OnApplicationBootstrap }   from '@nestjs/common'
import { EventPattern, MessagePattern }         from '@nestjs/microservices'
import { ServerPresence }                       from './services/server.presence'
import { PresenceEmitter }                      from './emitter/presence.emitter'
import { GetWorlds, WorldOffline, WorldOnline } from '../../../shared/actions/server-presence.actions'

@Controller()
export class PresenceController implements OnApplicationBootstrap {
    constructor(
        private server: ServerPresence,
        private emitter: PresenceEmitter
    ) {
    }

    @EventPattern(GetWorlds.type)
    async getServers() {
        this.emitter.sendWorlds(await this.server.getWorlds())
    }

    @MessagePattern(WorldOnline.type)
    register({ constant, name, port, instanceId, host }: WorldOnline) {
        console.log('world online!')
        return this.server.register(this.server.getHost(host), port, instanceId, constant, name)
    }

    @EventPattern(WorldOffline.type)
    async serverOffline({ serverId }: WorldOffline) {
        await this.server.offline(serverId)
    }

    async onApplicationBootstrap() {
        this.emitter.nowOnline()
    }
}
