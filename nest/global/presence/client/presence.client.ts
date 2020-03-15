import { Inject, Injectable }                        from '@nestjs/common'
import { ClientProxy }                               from '@nestjs/microservices'
import { first }                                     from 'rxjs/operators'
import { GetServers, RegisterServer, ServerOffline } from '../actions'
import { GLOBAL_CLIENT }                             from '../../../client/client.module'

@Injectable()
export class PresenceClient {

    constructor(@Inject(GLOBAL_CLIENT) private client: ClientProxy) {

    }

    async register(host: string, port: number, constant: string, name: string, instanceId: number): Promise<string> {
        return await this.client.send(RegisterServer.event, new RegisterServer(
            host,
            port,
            constant,
            name,
            instanceId
        )).pipe(first()).toPromise()
    }

     getServers() {
        this.client.emit(GetServers.event, {})
    }

    serverOffline(serverId: number) {
        this.client.emit(ServerOffline.event, new ServerOffline(serverId))
    }
}
