import {Module}          from '@nestjs/common';
import {StatsController} from './stats.controller';
import {StatsService}    from './stats.service';
import {DATABASE_MODULE} from "../../lib/database/database.module";
import {TypeOrmModule}   from "@nestjs/typeorm";

@Module({
    imports    : [TypeOrmModule.forRoot({
        ...DATABASE_MODULE,
        type    : 'mysql',
        database: 'stats',
        entities: [__dirname + '/entities/*{.js,.ts}']
    })],
    controllers: [StatsController],
    providers  : [StatsService],
})
export class StatsModule {
}
