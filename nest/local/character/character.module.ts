import { Module }              from '@nestjs/common'
import { CharacterController } from './character.controller'
import { CharacterService }    from './character.service'
import { TypeOrmModule }       from '@nestjs/typeorm'
import { Character }           from './entities/character'
import { CharacterEmitter }    from './character.emitter'
import { WorldConstants }      from '../../lib/constants/world.constants'
import * as path               from 'path'
import { environment }         from '../../lib/config/environment'
import { MapClientModule }     from '../map/client/map-client.module'
import { CharacterStats }      from './entities/character-stats'
import { CharacterParameters } from './entities/character-parameters'
import { ClientModule }        from '../../lib/client/client.module'


@Module({
    imports    : [
        ClientModule,
        MapClientModule,
        TypeOrmModule.forFeature([Character, CharacterStats, CharacterParameters]),
        TypeOrmModule.forRoot({
            type       : 'sqlite',
            database   : path.resolve(environment.dbRoot, WorldConstants.DB_NAME + '_character.db'),
            logging    : false,
            synchronize: true,
            entities   : [__dirname + '/entities/*{.ts,.js}']
        })
    ],
    controllers: [CharacterController],
    providers  : [CharacterService, CharacterEmitter]
})
export class CharacterModule {
}
