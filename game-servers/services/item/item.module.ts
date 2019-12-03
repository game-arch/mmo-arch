import {Module}            from '@nestjs/common';
import {ItemController}    from './item.controller';
import {ItemService}       from './item.service';
import {DB_CONFIG}         from "../../lib/config/db.config";
import {TypeOrmModule}     from "@nestjs/typeorm";
import {Inventory}         from "./entities/inventory";
import {InventoryItem}     from "./entities/inventory-item";
import {Item}              from "./entities/item";
import {ItemConfiguration} from "./entities/item-configuration";

@Module({
    imports    : [
        TypeOrmModule.forFeature([Inventory, InventoryItem, Item, ItemConfiguration]),
        TypeOrmModule.forRoot({
            ...DB_CONFIG,
            type    : 'mysql',
            database: 'item',
            entities: [__dirname + '/entities/*{.js,.ts}']
        })
    ],
    controllers: [ItemController],
    providers  : [ItemService],
})
export class ItemModule {
}
