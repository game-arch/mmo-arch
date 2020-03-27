import { Module }            from '@nestjs/common'
import { ClientModule }      from '../../client/client.module'
import { MapClientModule }   from '../map/client/map-client.module'
import { AiController }      from './ai.controller'
import { AiEmitter }         from './ai.emitter'
import { NpcService }        from './npc.service'
import { MovementService }   from './movement.service'
import { TypeOrmModule }     from '@nestjs/typeorm'
import { Character }         from '../character/entities/character'
import { ConnectionOptions } from 'typeorm'
import { DB_CONFIG }         from '../../lib/config/db.config'
import { WorldConstants }    from '../../lib/constants/world.constants'
import * as path             from "path"
import { environment }       from '../../lib/config/environment'
import { AiMob }             from './entities/ai-mob'

@Module({
    imports    : [
        ClientModule,
        MapClientModule,
        TypeOrmModule.forFeature([AiMob]),
        TypeOrmModule.forRoot(<ConnectionOptions>{
            ...DB_CONFIG,
            database   : DB_CONFIG.type === 'mysql' ? WorldConstants.DB_NAME + '_ai' : path.resolve(environment.dbRoot, WorldConstants.DB_NAME + '_ai.db'),
            logging    : false,
            synchronize: true,
            entities   : [__dirname + '/entities/*{.ts,.js}']
        })
    ],
    controllers: [AiController],
    providers  : [AiEmitter, NpcService, MovementService]
})
export class AiModule {

}
