import {Module}          from '@nestjs/common';
import {LobbyController} from './lobby.controller';
import {LobbyService}    from './lobby.service';
import {DATABASE_MODULE} from "../lib/database/database.module";
import {TypeOrmModule}   from "@nestjs/typeorm";
import {LobbyGateway}    from "./lobby.gateway";

@Module({
    imports    : [TypeOrmModule.forRoot({
        ...DATABASE_MODULE,
        type    : 'mysql',
        database: 'lobby',
        entities: [__dirname + '/**/*.entity{.js,.ts}']
    })],
    controllers: [LobbyController],
    providers  : [LobbyService, LobbyGateway],
})
export class LobbyModule {
}
