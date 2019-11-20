import {Module}          from '@nestjs/common';
import {MapController}   from './map.controller';
import {MapService}      from './map.service';
import {DATABASE_MODULE} from "../../lib/database.module";
import {TypeOrmModule}   from "@nestjs/typeorm";

@Module({
    imports    : [TypeOrmModule.forRoot({
        ...DATABASE_MODULE,
        type    : 'mysql',
        database: 'map',
        entities: [__dirname + '/entities/*{.js,.ts}']
    })],
    controllers: [MapController],
    providers  : [MapService],
})
export class MapModule {
}
