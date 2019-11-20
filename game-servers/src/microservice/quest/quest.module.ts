import {Module}          from '@nestjs/common';
import {QuestController} from './quest.controller';
import {QuestService}    from './quest.service';
import {DATABASE_MODULE} from "../../lib/database/database.module";
import {TypeOrmModule}   from "@nestjs/typeorm";

@Module({
    imports    : [TypeOrmModule.forRoot({
        ...DATABASE_MODULE,
        type    : 'mysql',
        database: 'quest',
        entities: [__dirname + '/entities/*{.js,.ts}']
    })],
    controllers: [QuestController],
    providers  : [QuestService],
})
export class QuestModule {
}
