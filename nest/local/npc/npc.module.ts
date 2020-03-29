import { Module }            from '@nestjs/common'
import { ClientModule }      from '../../client/client.module'
import { MapClientModule }   from '../map/client/map-client.module'
import { NpcController }     from './npc.controller'
import { NpcEmitter }        from './npc.emitter'
import { NpcService }        from './npc.service'
import { TypeOrmModule }     from '@nestjs/typeorm'
import { ConnectionOptions } from 'typeorm'
import { DB_CONFIG }         from '../../lib/config/db.config'
import { WorldConstants }    from '../../lib/constants/world.constants'
import * as path             from 'path'
import { environment }       from '../../lib/config/environment'
import { MobDistance }       from './entities/mob-distance'

@Module({
    imports    : [
        ClientModule,
        MapClientModule,
        TypeOrmModule.forFeature([MobDistance]),
        TypeOrmModule.forRoot(<ConnectionOptions>{
            ...DB_CONFIG,
            database   : DB_CONFIG.type === 'mysql' ? WorldConstants.DB_NAME + '_npc' : path.resolve(environment.dbRoot, WorldConstants.DB_NAME + '_npc.db'),
            logging    : false,
            synchronize: true,
            entities   : [__dirname + '/entities/*{.ts,.js}']
        })
    ],
    controllers: [NpcController],
    providers  : [NpcEmitter, NpcService]
})
export class NpcModule {

}
