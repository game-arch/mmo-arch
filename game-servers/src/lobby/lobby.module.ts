import {Module}          from '@nestjs/common';
import {LobbyController} from './lobby.controller';
import {LobbyService}    from './lobby.service';
import {DATABASE_MODULE} from "../lib/database/database.module";

@Module({
    imports    : [DATABASE_MODULE('lobby', __dirname)],
    controllers: [LobbyController],
    providers  : [LobbyService],
})
export class LobbyModule {
}
