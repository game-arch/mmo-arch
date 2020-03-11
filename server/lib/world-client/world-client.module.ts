import { Inject, Module, OnApplicationBootstrap } from '@nestjs/common'
import { ClientProxy, ClientProxyFactory }        from '@nestjs/microservices'
import { environment }                            from '../config/environment'
import { WorldConstants }                         from '../constants/world.constants'

export const clientFactory   = () => ClientProxyFactory.create(<any>{
    transport: environment.microservice.transport,
    options  : {
        ...environment.microservice.global,
        name : WorldConstants.NAME + ' Client',
        queue: WorldConstants.CONSTANT,
    },
})
export const CLIENT_PROVIDER = {
    provide   : 'WORLD_CLIENT',
    useFactory: clientFactory,
}

@Module({
    providers: [
        CLIENT_PROVIDER,
    ],
    exports  : [
        CLIENT_PROVIDER,
    ],
})
export class WorldClientModule implements OnApplicationBootstrap {
    constructor(@Inject('WORLD_CLIENT') private client: ClientProxy) {

    }

    async onApplicationBootstrap() {
        await this.client.connect()
    }


}
