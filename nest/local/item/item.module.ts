import { Module }                from '@nestjs/common'
import { TypeOrmModule }         from '@nestjs/typeorm'
import { WorldConstants }        from '../../lib/constants/world.constants'
import { WorldClientModule }     from '../../lib/world-client/world-client.module'
import { CharacterClientModule } from '../character/client/character-client.module'
import * as path                 from 'path'
import { environment }           from '../../lib/config/environment'
import { EquipmentSet }          from './entities/equipment-set'
import { ItemEffect }            from './entities/item-effect'
import { Item }                  from './entities/item'

@Module({
    imports    : [
        WorldClientModule,
        CharacterClientModule,
        TypeOrmModule.forFeature([EquipmentSet, Item, ItemEffect]),
        TypeOrmModule.forRoot({
            type       : 'sqlite',
            database   : path.resolve(environment.dbRoot, WorldConstants.DB_NAME + '_item.db'),
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
