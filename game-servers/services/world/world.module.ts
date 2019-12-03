import {Logger, Module}           from '@nestjs/common';
import {WorldController}          from './world.controller';
import {WorldService}             from './world.service';
import {WorldGateway}             from "./world.gateway";
import {AccountClientModule}      from "../account/client/account-client.module";
import {CharacterClientModule}    from "../character/client/character-client.module";
import {PresenceClientModule}     from "../presence/client/presence-client.module";
import {MicroserviceClientModule} from "../../lib/microservice-client/microservice-client.module";
import {MapClientModule}          from "../map/client/map-client.module";
import {MapController}            from "./map/map.controller";
import {MapGateway}               from "./map/map.gateway";
import {CharacterGateway}         from "./character/character.gateway";
import {CharacterController}      from "./character/character.controller";

@Module({
    imports    : [
        MicroserviceClientModule,
        AccountClientModule,
        CharacterClientModule,
        PresenceClientModule,
        MapClientModule
    ],
    controllers: [WorldController, MapController, CharacterController],
    providers  : [WorldService, WorldGateway, MapGateway, CharacterGateway, Logger],
})
export class WorldModule {
}
