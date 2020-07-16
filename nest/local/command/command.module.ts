import { Module }                from '@nestjs/common'
import { TypeOrmModule }         from '@nestjs/typeorm'
import { WorldConstants }        from '../../lib/constants/world.constants'
import { CharacterClientModule } from '../character/client/character-client.module'
import { ClientModule }          from '../../client/client.module'
import { DB_CONFIG }             from '../../lib/config/db.config'
import { ConnectionOptions }     from 'typeorm'
import { MapClientModule }       from '../map/client/map-client.module'
import { CommandController }     from './command.controller'
import { CommandExecution }      from './entities/command-execution'
import { CoolDownService }       from './cool-down.service'

@Module({
    imports    : [
        ClientModule,
        CharacterClientModule,
        MapClientModule,
        TypeOrmModule.forFeature([CommandExecution]),
        TypeOrmModule.forRoot(<ConnectionOptions>{
            ...DB_CONFIG,
            database: WorldConstants.DB_NAME + '_command',
            entities: [__dirname + '/entities/*{.ts,.js}']
        })
    ],
    controllers: [CommandController],
    providers  : [CoolDownService]
})
export class CommandModule {
}
