import {Logger, Module}        from '@nestjs/common';
import {WorldController}       from './world.controller';
import {WorldService}          from './world.service';
import {WorldGateway}          from "./world.gateway";
import {AccountClientModule}   from "../account/client/account-client.module";
import {CharacterClientModule} from "../character/client/character-client.module";
import {PresenceClientModule}  from "../presence/client/presence-client.module";
import {WorldClientModule}     from "../../lib/world-client/world-client.module";
import {MapClientModule}       from "../map/client/map-client.module";
import {MapController}         from "./map/map.controller";
import {MapGateway}            from "./map/map.gateway";
import {CharacterGateway}      from "./character/character.gateway";
import {CharacterController}   from "./character/character.controller";
import {ChatController}        from "./chat/chat.controller";
import {ChatGateway}           from "./chat/chat.gateway";
import {TypeOrmModule}         from "@nestjs/typeorm";
import {Player}                from "./entities/player";
import {WorldConstants}        from "../../lib/constants/world.constants";
import * as path               from "path";
import {environment}           from "../../lib/config/environment";

@Module({
    imports    : [
        TypeOrmModule.forRoot({
            type       : 'sqlite',
            database   : path.resolve(environment.dbRoot, WorldConstants.DB_NAME + process.env.NODE_APP_INSTANCE + '.db'),
            logging    : false,
            synchronize: true,
            entities   : [__dirname + '/entities/*{.ts,.js}'],
        }),
        TypeOrmModule.forFeature([Player]),
        WorldClientModule,
        AccountClientModule,
        CharacterClientModule,
        PresenceClientModule,
        MapClientModule
    ],
    controllers: [WorldController, MapController, CharacterController, ChatController],
    providers  : [WorldService, WorldGateway, MapGateway, CharacterGateway, ChatGateway, Logger],
})
export class WorldModule {
}
