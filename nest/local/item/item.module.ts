import { Module }                from '@nestjs/common'
import { TypeOrmModule }         from '@nestjs/typeorm'
import { WorldConstants }        from '../../lib/constants/world.constants'
import { CharacterClientModule } from '../character/client/character-client.module'
import { GemEffect }             from './entities/gem-effect'
import { Item }                  from './entities/item'
import { ClientModule }          from '../../client/client.module'
import { DB_CONFIG }             from '../../lib/config/db.config'
import { ConnectionOptions }     from 'typeorm'
import { InventoryItem }         from './entities/inventory-item'
import { Armor }                 from './entities/armor'
import { Weapon }                from './entities/weapon'
import { Gem }                   from './entities/gem'
import { ItemController }        from './item.controller'

@Module({
    imports    : [
        ClientModule,
        CharacterClientModule,
        TypeOrmModule.forFeature([Item, GemEffect, InventoryItem, Armor, Weapon, Gem]),
        TypeOrmModule.forRoot(<ConnectionOptions>{
            ...DB_CONFIG,
            database: WorldConstants.DB_NAME + '_item',
            entities: [__dirname + '/entities/*{.ts,.js}']
        })
    ],
    controllers: [ItemController],
    providers  : []
})
export class ItemModule {
}
