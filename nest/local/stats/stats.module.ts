import { Module }            from '@nestjs/common'
import { ClientModule }      from '../../client/client.module'
import { TypeOrmModule }     from '@nestjs/typeorm'
import { WorldConstants }    from '../../lib/constants/world.constants'
import { CharacterStats }    from './entities/character-stats'
import { NpcStats }          from './entities/npc-stats'
import { CharacterEffect }   from './entities/character-effect'
import { NpcEffect }         from './entities/npc-effect'
import { StatsController }   from './stats.controller'
import { DB_CONFIG }         from '../../lib/config/db.config'
import { ConnectionOptions } from 'typeorm'

@Module({
    imports    : [
        ClientModule,
        TypeOrmModule.forFeature([CharacterStats, NpcStats, CharacterEffect, NpcEffect]),
        TypeOrmModule.forRoot(<ConnectionOptions>{
            ...DB_CONFIG,
            database: WorldConstants.DB_NAME + '_stats',
            entities: [__dirname + '/entities/*{.ts,.js}']
        })
    ],
    controllers: [StatsController],
    providers  : []
})
export class StatsModule {
}
