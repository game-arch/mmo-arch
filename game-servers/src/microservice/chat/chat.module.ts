import {Module}          from '@nestjs/common';
import {ChatController}  from './chat.controller';
import {ChatService}     from './chat.service';
import {DATABASE_MODULE} from "../../lib/database/database.module";
import {TypeOrmModule}   from "@nestjs/typeorm";

@Module({
    imports    : [TypeOrmModule.forRoot({
        ...DATABASE_MODULE,
        type    : 'mysql',
        database: 'chat',
        entities: [__dirname + '/entities/*{.js,.ts}']
    })],
    controllers: [ChatController],
    providers  : [ChatService],
})
export class ChatModule {
}
