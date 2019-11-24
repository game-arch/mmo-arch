import {HttpModule, Logger, Module} from '@nestjs/common';
import {UserPresence}               from './services/user.presence';
import {PresenceController}         from "./presence.controller";
import {DATABASE_MODULE}            from "../../lib/database.module";
import {RegisteredWorld}            from "./entities/registered-world";
import {TypeOrmModule}              from "@nestjs/typeorm";
import {ConnectedUser}              from "./entities/connected-user";
import {PresenceClientModule}       from "./client/presence-client.module";
import {ServerPresence}             from "./services/server.presence";
import {CharacterPresence}          from "./services/character.presence";
import {PresenceEmitterModule}      from "./emitter/presence-emitter.module";

@Module({
    imports    : [
        HttpModule,
        PresenceEmitterModule,
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
