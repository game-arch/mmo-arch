import {Module}           from '@nestjs/common';
import {MapController}    from './map.controller';
import {MapService}       from './map.service';
import {DATABASE_MODULE}  from "../../lib/database.module";
import {TypeOrmModule}    from "@nestjs/typeorm";
import {PlayerLocation}   from "./entities/player-location";
import {Map}              from "./entities/map";
import {Resource}         from "./entities/resource";
import {ResourceDrop}     from "./entities/resource-drop";
import {NpcLocation}      from "./entities/npc-location";
import {ResourceLocation} from "./entities/resource-location";

@Module({
    imports    : [
        TypeOrmModule.forFeature([Map, Resource, ResourceDrop, NpcLocation, ResourceLocation, PlayerLocation]),
        TypeOrmModule.forRoot({
            ...DATABASE_MODULE,
            type    : 'mysql',
            database: 'map',
            entities: [__dirname + '/entities/*{.js,.ts}']
        })
    ],
    controllers: [MapController],
    providers  : [MapService],
})
export class MapModule {
}
