import { Module }                from '@nestjs/common'
import { TypeOrmModule }         from '@nestjs/typeorm'
import { WorldConstants }        from '../../lib/constants/world.constants'
import { CharacterClientModule } from '../character/client/character-client.module'
import { EquipmentSet }          from './entities/equipment-set'
import { GemEffect }             from './entities/gem-effect'
import { Item }                  from './entities/item'
import { ClientModule }          from '../../client/client.module'
import { DB_CONFIG }             from '../../lib/config/db.config'
import { ConnectionOptions }     from 'typeorm'
import { InventoryItem }         from './entities/inventory-item'
import { Armor }                 from './entities/armor'
import { Weapon }                from './entities/weapon'
import { Gem }                   from './entities/gem'
import { Equipment }             from './entities/equipment'

@Module({
    imports    : [
        ClientModule,
        CharacterClientModule,
        TypeOrmModule.forFeature([EquipmentSet, Item, GemEffect, InventoryItem, Armor, Weapon, Gem, Equipment]),
        TypeOrmModule.forRoot(<ConnectionOptions>{
            ...DB_CONFIG,
            database: WorldConstants.DB_NAME + '_item',
            entities: [__dirname + '/entities/*{.ts,.js}']
        })
    ],
    controllers: [],
    providers  : []
})
export class ItemModule {
}
