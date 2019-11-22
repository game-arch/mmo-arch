import {Module}               from '@nestjs/common';
import {LobbyController}      from './lobby.controller';
import {LobbyService}         from './lobby.service';
import {LobbyGateway}         from "./lobby.gateway";
import {AccountClientModule}  from "../../microservice/account/client/account-client.module";
import {PresenceClientModule} from "../../microservice/presence/client/presence-client.module";

@Module({
    imports    : [
        AccountClientModule,
        PresenceClientModule
    ],
    controllers: [LobbyController],
    providers  : [
        LobbyService,
        LobbyGateway
    ]
})
export class LobbyModule {
}
