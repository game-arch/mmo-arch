import {Module}          from '@nestjs/common';
import {QuestController} from './quest.controller';
import {QuestService}    from './quest.service';
import {DB_CONFIG}       from "../../lib/config/db.config";
import {TypeOrmModule}   from "@nestjs/typeorm";
import {WorldConstants}  from "../../lib/constants/world.constants";

@Module({
    imports    : [TypeOrmModule.forRoot({
        ...DB_CONFIG,
        type    : 'mysql',
        database: WorldConstants.DB_NAME,
        entities: [__dirname + '/entities/*{.js,.ts}']
    })],
    controllers: [QuestController],
    providers  : [QuestService],
})
export class QuestModule {
}
