import { Module }            from "@nestjs/common";
import { ItemController }    from "./item.controller";
import { ItemService }       from "./item.service";
import { TypeOrmModule }     from "@nestjs/typeorm";
import { Inventory }         from "./entities/inventory";
import { InventoryItem }     from "./entities/inventory-item";
import { Item }              from "./entities/item";
import { ItemConfiguration } from "./entities/item-configuration";
import { WorldConstants }    from "../../lib/constants/world.constants";
import * as path             from "path";
import { environment }       from "../../lib/config/environment";

@Module({
  imports    : [
    TypeOrmModule.forFeature([Inventory, InventoryItem, Item, ItemConfiguration]),
    TypeOrmModule.forRoot({
      type       : "sqlite",
      database   : path.resolve(environment.dbRoot, WorldConstants.DB_NAME + "_item.db"),
      logging    : false,
      synchronize: true,
      entities   : [__dirname + "/entities/*{.ts,.js}"]
    })
  ],
  controllers: [ItemController],
  providers  : [ItemService]
})
export class ItemModule {
}
