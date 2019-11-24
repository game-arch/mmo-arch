import {Module}          from '@nestjs/common';
import {ChatController}  from './chat.controller';
import {ChatService}     from './chat.service';
import {DATABASE_MODULE} from "../../lib/database.module";
import {TypeOrmModule}   from "@nestjs/typeorm";
import {WorldConstants}  from "../constants";

@Module({
    imports    : [TypeOrmModule.forRoot({
        ...DATABASE_MODULE,
        type    : 'mysql',
        database: WorldConstants.DB_NAME,
        entities: [__dirname + '/entities/*{.js,.ts}']
    })],
    controllers: [ChatController],
    providers  : [ChatService],
})
export class ChatModule {
}
