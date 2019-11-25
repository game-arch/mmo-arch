import {HttpModule, Logger, Module} from '@nestjs/common';
import {PresenceController}         from "./presence.controller";
import {DATABASE_MODULE}            from "../../lib/database.module";
import {RegisteredWorld}            from "./entities/registered-world";
import {TypeOrmModule}              from "@nestjs/typeorm";
import {ServerPresence}             from "./services/server.presence";
import {PresenceEmitterModule}      from "./emitter/presence-emitter.module";

@Module({
    imports    : [
        HttpModule,
        PresenceEmitterModule,
        TypeOrmModule.forFeature([RegisteredWorld]),
        TypeOrmModule.forRoot({
            ...DATABASE_MODULE,
            type    : 'mysql',
            database: 'presence',
            entities: [__dirname + '/entities/*{.js,.ts}']
        })
    ],
    providers  : [Logger, ServerPresence],
    controllers: [PresenceController]
})
export class PresenceModule {
}
