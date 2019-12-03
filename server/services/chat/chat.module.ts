import {Module}         from '@nestjs/common';
import {ChatController} from './chat.controller';
import {ChatService}    from './chat.service';
import {DB_CONFIG}      from "../../lib/config/db.config";
import {TypeOrmModule}  from "@nestjs/typeorm";

@Module({
    imports    : [TypeOrmModule.forRoot({
        ...DB_CONFIG,
        type    : 'mysql',
        database: 'chat',
        entities: [__dirname + '/entities/*{.js,.ts}']
    })],
    controllers: [ChatController],
    providers  : [ChatService],
})
export class ChatModule {
}
