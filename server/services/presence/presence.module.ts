import {HttpModule, Logger, Module} from '@nestjs/common';
import {PresenceController}         from "./presence.controller";
import {DB_CONFIG}                  from "../../lib/config/db.config";
import {World}                      from "./entities/world";
import {TypeOrmModule}              from "@nestjs/typeorm";
import {ServerPresence}             from "./services/server.presence";
import {PresenceEmitterModule}      from "./emitter/presence-emitter.module";

@Module({
    imports    : [
        HttpModule,
        PresenceEmitterModule,
        TypeOrmModule.forFeature([World]),
        TypeOrmModule.forRoot({
            ...DB_CONFIG,
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
