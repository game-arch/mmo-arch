import { Module }          from "@nestjs/common";
import { QuestController } from "./quest.controller";
import { QuestService }    from "./quest.service";
import { TypeOrmModule }   from "@nestjs/typeorm";
import { WorldConstants }  from "../../lib/constants/world.constants";
import * as path           from "path";
import { environment }     from "../../lib/config/environment";

@Module({
  imports    : [TypeOrmModule.forRoot({
    type       : "sqlite",
    database   : path.resolve(environment.dbRoot, WorldConstants.DB_NAME + "_quest.db"),
    logging    : false,
    synchronize: true,
    entities   : [__dirname + "/entities/*{.ts,.js}"]
  })],
  controllers: [QuestController],
  providers  : [QuestService]
})
export class QuestModule {
}
