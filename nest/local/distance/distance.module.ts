import { Module }             from '@nestjs/common'
import { ClientModule }       from '../../client/client.module'
import { MapClientModule }    from '../map/client/map-client.module'
import { DistanceController } from './distance.controller'
import { DistanceService }    from './distance.service'
import { TypeOrmModule }      from '@nestjs/typeorm'
import { ConnectionOptions }  from 'typeorm'
import { DB_CONFIG }          from '../../lib/config/db.config'
import { WorldConstants }     from '../../lib/constants/world.constants'
import { Distance }           from './entities/distance'

@Module({
    imports    : [
        ClientModule,
        MapClientModule,
        TypeOrmModule.forFeature([Distance]),
        TypeOrmModule.forRoot(<ConnectionOptions>{
            ...DB_CONFIG,
            database   : WorldConstants.DB_NAME + '_distance',
            entities   : [__dirname + '/entities/*{.ts,.js}']
        })
    ],
    controllers: [DistanceController],
    providers  : [DistanceService]
})
export class DistanceModule {

}
