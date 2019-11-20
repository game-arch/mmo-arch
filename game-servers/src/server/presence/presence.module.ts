import {Module}             from '@nestjs/common';
import {PresenceController} from './presence.controller';
import {PresenceService}    from './presence.service';
import {PresenceGateway}    from "./presence.gateway";
import {DATABASE_MODULE}    from "../../lib/database.module";
import {RegisteredWorld}    from "./entities/registered-world";
import {TypeOrmModule}      from "@nestjs/typeorm";
import {ConnectedUser}      from "./entities/connected-user";

@Module({
    imports    : [
        TypeOrmModule.forFeature([RegisteredWorld, ConnectedUser]),
        TypeOrmModule.forRoot({
            ...DATABASE_MODULE,
            type    : 'mysql',
            database: 'presence',
            entities: [__dirname + '/entities/*{.js,.ts}']
        })
    ],
    providers  : [PresenceGateway, PresenceService],
    controllers: [PresenceController],
    exports    : [PresenceGateway]
})
export class PresenceModule {
}
