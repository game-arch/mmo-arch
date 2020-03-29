import { Module }              from '@nestjs/common'
import { CharacterController } from './character.controller'
import { CharacterService }    from './character.service'
import { TypeOrmModule }       from '@nestjs/typeorm'
import { Character }           from './entities/character'
import { CharacterEmitter }    from './character.emitter'
import { WorldConstants }      from '../../lib/constants/world.constants'
import { MapClientModule }     from '../map/client/map-client.module'
import { ClientModule }        from '../../client/client.module'
import { DB_CONFIG }           from '../../lib/config/db.config'
import { ConnectionOptions }   from 'typeorm'


@Module({
    imports    : [
        ClientModule,
        MapClientModule,
        TypeOrmModule.forFeature([Character]),
        TypeOrmModule.forRoot(<ConnectionOptions>{
            ...DB_CONFIG,
            database   : WorldConstants.DB_NAME + '_character',
            entities   : [__dirname + '/entities/*{.ts,.js}']
        })
    ],
    controllers: [CharacterController],
    providers  : [CharacterService, CharacterEmitter]
})
export class CharacterModule {
}
