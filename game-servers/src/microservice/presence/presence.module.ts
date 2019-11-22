import {HttpModule, Logger, Module} from '@nestjs/common';
import {PresenceService}            from './presence.service';
import {PresenceController}         from "./presence.controller";
import {DATABASE_MODULE}            from "../../lib/database.module";
import {RegisteredWorld}            from "./entities/registered-world";
import {TypeOrmModule}              from "@nestjs/typeorm";
import {ConnectedUser}              from "./entities/connected-user";
import {PresenceClientModule}       from "./client/presence-client.module";

@Module({
    imports    : [
        HttpModule,
        PresenceClientModule,
        TypeOrmModule.forFeature([RegisteredWorld, ConnectedUser]),
        TypeOrmModule.forRoot({
            ...DATABASE_MODULE,
            type    : 'mysql',
            database: 'presence',
            entities: [__dirname + '/entities/*{.js,.ts}']
        })
    ],
    providers  : [PresenceService, Logger],
    controllers: [PresenceController]
})
export class PresenceModule {
}
