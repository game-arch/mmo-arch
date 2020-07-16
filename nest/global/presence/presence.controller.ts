import { Controller, OnApplicationBootstrap }   from '@nestjs/common'
import { EventPattern, MessagePattern }         from '@nestjs/microservices'
import { ServerPresence }                       from './services/server.presence'
import { PresenceEmitter }                      from './emitter/presence.emitter'
import { GetWorlds, WorldOffline, WorldOnline } from '../../../shared/actions/server-presence.actions'
import { GlobalEvent }                          from '../../lib/event.types'

@Controller('/test')
export class PresenceController implements OnApplicationBootstrap {
    constructor(
        private server: ServerPresence,
        private emitter: PresenceEmitter
    ) {
    }

    @EventPattern(new GlobalEvent(GetWorlds.type))
    async getServers() {
        this.emitter.sendWorlds(await this.server.getWorlds())
    }

    @MessagePattern(new GlobalEvent(WorldOnline.type))
    register({ constant, name, port, instanceId, host }: WorldOnline) {
        return this.server.register(this.server.getHost(host), port, instanceId, constant, name)
    }

    @EventPattern(new GlobalEvent(WorldOffline.type))
    async serverOffline({ serverId }: WorldOffline) {
        await this.server.offline(serverId)
    }

    async onApplicationBootstrap() {
        try {
            this.emitter.nowOnline()
        } catch (e) {
            console.log(e)
        }
    }
}
