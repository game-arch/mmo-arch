import { Inject, Injectable }         from '@nestjs/common'
import { ClientProxy }                from '@nestjs/microservices'
import { GameWorld }                        from '../../../../shared/interfaces/game-world'
import { GetServers, ServerPresenceOnline } from '../../../../shared/events/server-presence.events'
import { GLOBAL_CLIENT }                    from '../../../client/client.module'

@Injectable()
export class PresenceEmitter {

    constructor(@Inject(GLOBAL_CLIENT) private client: ClientProxy) {

    }

    sendServers(servers: GameWorld[]) {
        this.client.emit(GetServers.event + '.response', servers)
    }

    nowOnline() {
        this.client.emit(ServerPresenceOnline.event, {})
    }
}
