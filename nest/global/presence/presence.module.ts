import { HttpModule, Logger, Module } from '@nestjs/common'
import { PresenceController }         from './presence.controller'
import { World }                      from './entities/world'
import { TypeOrmModule }              from '@nestjs/typeorm'
import { ServerPresence }             from './services/server.presence'
import { PresenceEmitterModule }      from './emitter/presence-emitter.module'
import { DB_CONFIG }                  from '../../lib/config/db.config'
import { ConnectionOptions }          from 'typeorm'

@Module({
    imports    : [
        HttpModule,
        PresenceEmitterModule,
        TypeOrmModule.forFeature([World]),
        TypeOrmModule.forRoot(<ConnectionOptions>{
            ...DB_CONFIG,
            database   : 'account',
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
