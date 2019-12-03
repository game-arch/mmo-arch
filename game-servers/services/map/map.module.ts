import {Module}                   from '@nestjs/common';
import {MapController}            from './map.controller';
import {MapService}               from './map.service';
import {DB_CONFIG}                from "../../lib/config/db.config";
import {TypeOrmModule}            from "@nestjs/typeorm";
import {Player}                   from "./entities/player";
import {Map}                      from "./entities/map";
import {Resource}                 from "./entities/resource";
import {ResourceDrop}             from "./entities/resource-drop";
import {NpcLocation}              from "./entities/npc-location";
import {ResourceLocation}         from "./entities/resource-location";
import {WorldConstants}           from "../../lib/constants/world.constants";
import {TutorialMap}              from "./maps/tutorial.map";
import {MicroserviceClientModule} from "../../lib/microservice-client/microservice-client.module";
import {MapEmitter}               from "./map.emitter";
import {CharacterClientModule}    from "../character/client/character-client.module";
import {MapTransition}            from "./entities/map-transition";

@Module({
    imports    : [
        MicroserviceClientModule,
        CharacterClientModule,
        TypeOrmModule.forFeature([Map, MapTransition, Resource, ResourceDrop, NpcLocation, ResourceLocation, Player]),
        TypeOrmModule.forRoot({
            ...DB_CONFIG,
            type    : 'mysql',
            database: WorldConstants.DB_NAME,
            entities: [__dirname + '/entities/*{.js,.ts}']
        })
    ],
    controllers: [MapController],
    providers  : [
        MapService,
        MapEmitter,
        {
            provide : 'tutorial',
            useClass: TutorialMap
        }
    ],
})
export class MapModule {
}
