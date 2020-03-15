import { Logger, Module }       from '@nestjs/common'
import { LobbyController }      from './lobby.controller'
import { LobbyService }         from './lobby.service'
import { LobbyGateway }         from './lobby.gateway'
import { AccountClientModule }  from '../account/client/account-client.module'
import { PresenceClientModule } from '../presence/client/presence-client.module'

@Module({
    imports    : [
        AccountClientModule,
        PresenceClientModule
    ],
    controllers: [LobbyController],
    providers  : [
        LobbyService,
        LobbyGateway,
        Logger
    ]
})
export class LobbyModule {
}
