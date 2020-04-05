import { Inject, Injectable }                   from '@nestjs/common'
import { ClientProxy }                          from '@nestjs/microservices'
import { first }                                from 'rxjs/operators'
import { GetWorlds, WorldOffline, WorldOnline } from '../../../../shared/actions/server-presence.actions'
import { GLOBAL_CLIENT }                        from '../../../client/client.module'

@Injectable()
export class PresenceClient {

    constructor(@Inject(GLOBAL_CLIENT) private client: ClientProxy) {

    }

    async register(host: string, port: number, constant: string, name: string, instanceId: number): Promise<string> {
        try {
            console.log('REGISTER', new WorldOnline(
                host,
                port,
                constant,
                name,
                instanceId
            ))
            return await this.client.send(WorldOnline.type, new WorldOnline(
                host,
                port,
                constant,
                name,
                instanceId
            )).pipe(first()).toPromise()
        } catch (e) {
            console.log(e)
        }
    }

    getWorlds() {
        this.client.emit(GetWorlds.type, {})
    }

    worldOffline(serverId: number) {
        this.client.emit(WorldOffline.type, new WorldOffline(serverId))
    }
}
