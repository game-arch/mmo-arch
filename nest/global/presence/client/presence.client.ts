import { Inject, Injectable }                   from '@nestjs/common'
import { ClientProxy }                          from '@nestjs/microservices'
import { first }                                from 'rxjs/operators'
import { GetWorlds, WorldOffline, WorldOnline } from '../../../../shared/actions/server-presence.actions'
import { GLOBAL_CLIENT }                        from '../../../client/client.module'
import { GlobalEvent }                          from '../../../lib/event.types'

@Injectable()
export class PresenceClient {

    constructor(@Inject(GLOBAL_CLIENT) private client: ClientProxy) {

    }

    async register(host: string, port: number, constant: string, name: string, instanceId: number): Promise<string> {
        return await this.client.send(new GlobalEvent(WorldOnline.type), new WorldOnline(
            host,
            port,
            constant,
            name,
            instanceId
        )).pipe(first()).toPromise()
    }

    getWorlds() {
        this.client.emit(new GlobalEvent(GetWorlds.type), {})
    }

    worldOffline(serverId: number) {
        this.client.emit(new GlobalEvent(WorldOffline.type), new WorldOffline(serverId))
    }
}
