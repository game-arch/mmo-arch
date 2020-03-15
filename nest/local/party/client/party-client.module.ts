import { Module }             from '@nestjs/common'
import { PartyClient }        from './party-client.service'
import { ClientProxyFactory } from '@nestjs/microservices'
import { environment }        from '../../../lib/config/environment'
import { WorldConstants }     from '../../../lib/constants/world.constants'

export const clientFactory   = () => ClientProxyFactory.create({
    transport: environment.microservice.transport,
    options  : {
        ...environment.microservice.local,
        name : WorldConstants.NAME + ' Party Client',
        queue: WorldConstants.CONSTANT + '-party'
    }
} as any)
export const CLIENT_PROVIDER = {
    provide   : 'PARTY_CLIENT',
    useFactory: clientFactory
}

@Module({
    providers: [
        CLIENT_PROVIDER,
        PartyClient
    ],
    exports  : [
        PartyClient
    ]
})
export class PartyClientModule {

}
