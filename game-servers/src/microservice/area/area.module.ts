import {Module}          from '@nestjs/common';
import {AreaController}  from './area.controller';
import {AreaService}     from './area.service';
import {DATABASE_MODULE} from "../../lib/database.module";
import {TypeOrmModule}   from "@nestjs/typeorm";

@Module({
    imports    : [TypeOrmModule.forRoot({
        ...DATABASE_MODULE,
        type    : 'mysql',
        database: 'map',
        entities: [__dirname + '/entities/*{.js,.ts}']
    })],
    controllers: [AreaController],
    providers  : [AreaService],
})
export class AreaModule {
}
