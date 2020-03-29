import { Module }                from '@nestjs/common'
import { TypeOrmModule }         from '@nestjs/typeorm'
import { WorldConstants }        from '../../lib/constants/world.constants'
import { CharacterClientModule } from '../character/client/character-client.module'
import { EquipmentSet }          from './entities/equipment-set'
import { ItemEffect }            from './entities/item-effect'
import { Item }                  from './entities/item'
import { ClientModule }          from '../../client/client.module'
import { DB_CONFIG }             from '../../lib/config/db.config'
import { ConnectionOptions }     from 'typeorm'

@Module({
    imports    : [
        ClientModule,
        CharacterClientModule,
        TypeOrmModule.forFeature([EquipmentSet, Item, ItemEffect]),
        TypeOrmModule.forRoot(<ConnectionOptions>{
            ...DB_CONFIG,
            database   : WorldConstants.DB_NAME + '_item',
            logging    : false,
            synchronize: true,
            entities   : [__dirname + '/entities/*{.ts,.js}']
        })
    ],
    controllers: [],
    providers  : []
})
export class ItemModule {
}
