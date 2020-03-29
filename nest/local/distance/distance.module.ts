import { Module }             from '@nestjs/common'
import { ClientModule }       from '../../client/client.module'
import { MapClientModule }    from '../map/client/map-client.module'
import { DistanceController } from './distance.controller'
import { DistanceService }    from './distance.service'
import { TypeOrmModule }      from '@nestjs/typeorm'
import { ConnectionOptions }  from 'typeorm'
import { DB_CONFIG }          from '../../lib/config/db.config'
import { WorldConstants }     from '../../lib/constants/world.constants'
import * as path              from 'path'
import { environment } from '../../lib/config/environment'
import { Distance }    from './entities/distance'

@Module({
    imports    : [
        ClientModule,
        MapClientModule,
        TypeOrmModule.forFeature([Distance]),
        TypeOrmModule.forRoot(<ConnectionOptions>{
            ...DB_CONFIG,
            database   : DB_CONFIG.type === 'mysql' ? WorldConstants.DB_NAME + '_distance' : path.resolve(environment.dbRoot, WorldConstants.DB_NAME + '_distance.db'),
            logging    : false,
            synchronize: true,
            entities   : [__dirname + '/entities/*{.ts,.js}']
        })
    ],
    controllers: [DistanceController],
    providers  : [DistanceService]
})
export class DistanceModule {

}
