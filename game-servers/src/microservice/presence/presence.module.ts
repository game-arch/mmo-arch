import {HttpModule, Logger, Module} from '@nestjs/common';
import {UserPresence}               from './user.presence';
import {PresenceController}         from "./presence.controller";
import {DATABASE_MODULE}            from "../../lib/database.module";
import {RegisteredWorld}            from "./entities/registered-world";
import {TypeOrmModule}              from "@nestjs/typeorm";
import {ConnectedUser}              from "./entities/connected-user";
import {PresenceClientModule}       from "./client/presence-client.module";
import {ServerPresence}             from "./server.presence";
import {CharacterPresence}          from "./character.presence";

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
    providers  : [UserPresence, Logger, ServerPresence, CharacterPresence],
    controllers: [PresenceController]
})
export class PresenceModule {
}
