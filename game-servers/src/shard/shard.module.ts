import {Module}              from '@nestjs/common';
import {ShardController}     from './shard.controller';
import {ShardService}        from './shard.service';
import {ShardGateway}        from "./shard.gateway";
import {DATABASE_MODULE}     from "../lib/database/database.module";
import {TypeOrmModule}       from "@nestjs/typeorm";
import {Character}           from "./entities/character";
import {Inventory}           from "./entities/inventory";
import {InventoryItem}       from "./entities/inventory-item";
import {Item}                from "./entities/item";
import {ItemConfiguration}   from "./entities/item-configuration";
import {AccountClientModule} from "../lib/microservice/account/account-client.module";

@Module({
    imports    : [
        AccountClientModule,
        TypeOrmModule.forFeature([Character, Inventory, InventoryItem, Item, ItemConfiguration]),
        TypeOrmModule.forRoot({
            ...DATABASE_MODULE,
            type    : 'mysql',
            database: 'shard',
            entities: [__dirname + '/entities/*{.js,.ts}']
        })
    ],
    controllers: [ShardController],
    providers  : [ShardService, ShardGateway],
})
export class ShardModule {
}
