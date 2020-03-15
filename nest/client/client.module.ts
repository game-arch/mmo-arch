import { Module }             from '@nestjs/common'
import { ClientProxyFactory } from '@nestjs/microservices'
import { environment }        from '../lib/config/environment'

export const GLOBAL_CLIENT = 'GLOBAL_CLIENT'
export const LOCAL_CLIENT  = 'LOCAL_CLIENT'

export const localClientFactory  = () => ClientProxyFactory.create({
    transport: environment.microservice.transport,
    options  : {
        ...environment.microservice.local
    }
} as any)
export const LOCAL_PROVIDER      = {
    provide   : LOCAL_CLIENT,
    useFactory: localClientFactory
}
export const globalClientFactory = () => ClientProxyFactory.create({
    transport: environment.microservice.transport,
    options  : {
        ...environment.microservice.global
    }
} as any)

export const GLOBAL_PROVIDER = {
    provide   : GLOBAL_CLIENT,
    useFactory: globalClientFactory
}

@Module({
    providers: [
        LOCAL_PROVIDER,
        GLOBAL_PROVIDER
    ],
    exports  : [
        LOCAL_PROVIDER,
        GLOBAL_PROVIDER
    ]
})
export class ClientModule {

}
