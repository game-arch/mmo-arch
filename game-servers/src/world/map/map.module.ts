import {Module}                   from '@nestjs/common';
import {MapController}            from './map.controller';
import {MapService}               from './map.service';
import {DATABASE_MODULE}          from "../../lib/database.module";
import {TypeOrmModule}            from "@nestjs/typeorm";
import {Player}                   from "./entities/player";
import {Map}                      from "./entities/map";
import {Resource}                 from "./entities/resource";
import {ResourceDrop}             from "./entities/resource-drop";
import {NpcLocation}              from "./entities/npc-location";
import {ResourceLocation}         from "./entities/resource-location";
import {WorldConstants}           from "../constants";
import {TutorialMap}              from "./maps/tutorial.map";
import {MicroserviceClientModule} from "../../lib/microservice-client.module";
import {MapEmitter}               from "./map.emitter";
import {CharacterClientModule}    from "../../global/character/client/character-client.module";

@Module({
    imports    : [
        MicroserviceClientModule,
        CharacterClientModule,
        TypeOrmModule.forFeature([Map, Resource, ResourceDrop, NpcLocation, ResourceLocation, Player]),
        TypeOrmModule.forRoot({
            ...DATABASE_MODULE,
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
