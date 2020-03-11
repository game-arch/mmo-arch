import { HttpModule, Logger, Module } from '@nestjs/common'
import { PresenceController }         from './presence.controller'
import { World }                      from './entities/world'
import { TypeOrmModule }              from '@nestjs/typeorm'
import { ServerPresence }             from './services/server.presence'
import { PresenceEmitterModule }      from './emitter/presence-emitter.module'
import { environment }                from '../../../lib/config/environment'
import * as path                      from 'path'

@Module({
    imports    : [
        HttpModule,
        PresenceEmitterModule,
        TypeOrmModule.forFeature([World]),
        TypeOrmModule.forRoot({
            type       : 'sqlite',
            database   : path.resolve(environment.dbRoot, 'presence.db'),
            logging    : false,
            synchronize: true,
            entities   : [__dirname + '/entities/*{.ts,.js}']
        })
    ],
    providers  : [Logger, ServerPresence],
    controllers: [PresenceController]
})
export class PresenceModule {
}
