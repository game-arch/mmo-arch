import { Module }                from '@nestjs/common'
import { TypeOrmModule }         from '@nestjs/typeorm'
import { WorldConstants }        from '../../lib/constants/world.constants'
import * as path                 from 'path'
import { environment }           from '../../lib/config/environment'
import { Party }                 from './entities/party'
import { PartyController }       from './party.controller'
import { PartyService }          from './party.service'
import { PartyEmitter }          from './party.emitter'
import { CharacterClientModule } from '../character/client/character-client.module'
import { ClientModule }          from '../../client/client.module'
import { DB_CONFIG }             from '../../lib/config/db.config'
import { ConnectionOptions }     from 'typeorm'

@Module({
    imports    : [
        ClientModule,
        CharacterClientModule,
        TypeOrmModule.forFeature([Party]),
        TypeOrmModule.forRoot(<ConnectionOptions>{
            ...DB_CONFIG,
            database   : DB_CONFIG.type === 'mysql' ? WorldConstants.DB_NAME + '_party' : path.resolve(environment.dbRoot, WorldConstants.DB_NAME + '_party.db'),
            logging    : false,
            synchronize: true,
            entities   : [__dirname + '/entities/*{.ts,.js}']
        })
    ],
    controllers: [PartyController],
    providers  : [PartyService, PartyEmitter]
})
export class PartyModule {
}
