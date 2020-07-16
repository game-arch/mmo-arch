import { HttpModule, Logger, Module } from '@nestjs/common'
import { PresenceController }         from './presence.controller'
import { World }                      from './entities/world'
import { TypeOrmModule }              from '@nestjs/typeorm'
import { ServerPresence }             from './services/server.presence'
import { DB_CONFIG }                  from '../../lib/config/db.config'
import { ConnectionOptions }          from 'typeorm'
import { ClientModule }               from '../../client/client.module'
import { PresenceEmitter }            from './emitter/presence.emitter'

@Module({
    imports    : [
        HttpModule,
        ClientModule,
        TypeOrmModule.forFeature([World]),
        TypeOrmModule.forRoot(<ConnectionOptions>{
            ...DB_CONFIG,
            database: 'presence',
            entities: [__dirname + '/entities/*{.ts,.js}']
        })
    ],
    providers  : [Logger, ServerPresence, PresenceEmitter],
    controllers: [PresenceController]
})
export class PresenceModule {
}
