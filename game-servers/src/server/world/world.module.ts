import {Logger, Module}           from '@nestjs/common';
import {WorldController}          from './world.controller';
import {WorldService}             from './world.service';
import {WorldGateway}             from "./world.gateway";
import {AccountClientModule}      from "../../microservice/account/client/account-client.module";
import {CharacterClientModule}    from "../../microservice/character/client/character-client.module";
import {PresenceClientModule}     from "../../microservice/presence/client/presence-client.module";
import {MicroserviceClientModule} from "../../microservice/microservice-client.module";

@Module({
    imports    : [
        MicroserviceClientModule,
        AccountClientModule,
        CharacterClientModule,
        PresenceClientModule
    ],
    controllers: [WorldController],
    providers  : [WorldService, WorldGateway, Logger],
})
export class WorldModule {
}
