import { Module }                from '@nestjs/common'
import { MapController }         from './map.controller'
import { MapService }            from './map.service'
import { TypeOrmModule }         from '@nestjs/typeorm'
import { Player }                from './entities/player'
import { WorldConstants }        from '../../lib/constants/world.constants'
import { MapEmitter }            from './map.emitter'
import { CharacterClientModule } from '../character/client/character-client.module'
import * as path                 from 'path'
import { environment }           from '../../lib/config/environment'
import { ClientModule }          from '../../client/client.module'
import { TUTORIAL_CONFIG }       from '../../../shared/maps/tutorial'
import { TUTORIAL_2_CONFIG }     from '../../../shared/maps/tutorial-2'
import { BaseScene }             from '../../../shared/phaser/base.scene'
import { DB_CONFIG }             from '../../lib/config/db.config'
import { ConnectionOptions }     from 'typeorm'

@Module({
    imports    : [
        ClientModule,
        CharacterClientModule,
        TypeOrmModule.forFeature([Player]),
        TypeOrmModule.forRoot(<ConnectionOptions>{
            ...DB_CONFIG,
            database   : DB_CONFIG.type === 'mysql' ? WorldConstants.DB_NAME + '_map' : path.resolve(environment.dbRoot, WorldConstants.DB_NAME + '_map.db'),
            logging    : false,
            synchronize: true,
            entities   : [__dirname + '/entities/*{.ts,.js}']
        })
    ],
    controllers: [MapController],
    providers  : [
        MapService,
        MapEmitter,
        {
            provide   : 'tutorial',
            useFactory: () => new BaseScene(TUTORIAL_CONFIG)
        },
        {
            provide   : 'tutorial-2',
            useFactory: () => new BaseScene(TUTORIAL_2_CONFIG)
        }
    ]
})
export class MapModule {
}
