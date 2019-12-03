import {Module}         from '@nestjs/common';
import {ChatController} from './chat.controller';
import {ChatService}    from './chat.service';
import {DB_CONFIG}      from "../../lib/config/db.config";
import {TypeOrmModule}  from "@nestjs/typeorm";
import {WorldConstants} from "../../lib/constants/world.constants";

@Module({
    imports    : [TypeOrmModule.forRoot({
        ...DB_CONFIG,
        type    : 'mysql',
        database: WorldConstants.DB_NAME,
        entities: [__dirname + '/entities/*{.js,.ts}']
    })],
    controllers: [ChatController],
    providers  : [ChatService],
})
export class ChatModule {
}
