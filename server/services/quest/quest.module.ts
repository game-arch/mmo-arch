import {Module}          from '@nestjs/common';
import {QuestController} from './quest.controller';
import {QuestService}    from './quest.service';
import {DB_CONFIG}       from "../../lib/config/db.config";
import {TypeOrmModule}   from "@nestjs/typeorm";

@Module({
    imports    : [TypeOrmModule.forRoot({
        ...DB_CONFIG,
        type    : 'mysql',
        database: 'quest',
        entities: [__dirname + '/entities/*{.js,.ts}']
    })],
    controllers: [QuestController],
    providers  : [QuestService],
})
export class QuestModule {
}
