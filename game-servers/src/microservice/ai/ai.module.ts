import {Module}          from '@nestjs/common';
import {AiController}    from './ai.controller';
import {AiService}       from './ai.service';
import {DATABASE_MODULE} from "../../lib/database/database.module";
import {TypeOrmModule}   from "@nestjs/typeorm";

@Module({
    imports    : [TypeOrmModule.forRoot({
        ...DATABASE_MODULE,
        type    : 'mysql',
        database: 'map',
        entities: [__dirname + '/entities/*{.js,.ts}']
    })],
    controllers: [AiController],
    providers  : [AiService],
})
export class AiModule {
}
