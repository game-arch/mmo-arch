import { Logger, Module }        from '@nestjs/common'
import { MapController }         from './map.controller'
import { MapService }            from './map.service'
import { TypeOrmModule }         from '@nestjs/typeorm'
import { Player }                from './entities/player'
import { WorldConstants }        from '../../lib/constants/world.constants'
import { MapEmitter }            from './map.emitter'
import { CharacterClientModule } from '../character/client/character-client.module'
import { ClientModule }          from '../../client/client.module'
import { BaseScene }             from '../../../shared/phaser/base.scene'
import { DB_CONFIG }             from '../../lib/config/db.config'
import { ConnectionOptions }     from 'typeorm'
import { Channel }               from './entities/channel'
import { MapConstants }          from './constants'
import { MapClientModule }   from './client/map-client.module'
import { CommandController } from './command.controller'

@Module({
    imports    : [
        ClientModule,
        CharacterClientModule,
        MapClientModule,
        TypeOrmModule.forFeature([Player, Channel]),
        TypeOrmModule.forRoot(<ConnectionOptions>{
            ...DB_CONFIG,
            database: WorldConstants.DB_NAME + '_map',
            entities: [__dirname + '/entities/*{.ts,.js}']
        })
    ],
    controllers: [MapController, CommandController],
    providers  : [
        Logger,
        MapService,
        MapEmitter,
        {
            provide   : MapConstants.MAP,
            useFactory: () => new BaseScene(MapConstants.MAPS[MapConstants.MAP])
        }
    ]
})
export class MapModule {
}
