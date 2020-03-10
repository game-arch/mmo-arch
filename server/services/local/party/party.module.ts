import { Module }                from "@nestjs/common";
import { TypeOrmModule }         from "@nestjs/typeorm";
import { WorldClientModule }     from "../../../lib/world-client/world-client.module";
import { WorldConstants }        from "../../../lib/constants/world.constants";
import * as path                 from "path";
import { environment }           from "../../../lib/config/environment";
import { Party }                 from "./entities/party";
import { PartyController }       from "./party.controller";
import { PartyService }          from "./party.service";
import { PartyEmitter }          from "./party.emitter";
import { CharacterClientModule } from "../character/client/character-client.module";

@Module({
    imports    : [
        WorldClientModule,
        CharacterClientModule,
        TypeOrmModule.forFeature([Party]),
        TypeOrmModule.forRoot({
            type       : "sqlite",
            database   : path.resolve(
                environment.dbRoot,
                WorldConstants.DB_NAME + "_party.db"
            ),
            logging    : false,
            synchronize: true,
            entities   : [__dirname + "/entities/*{.ts,.js}"]
        })
    ],
    controllers: [PartyController],
    providers  : [PartyService, PartyEmitter]
})
export class PartyModule {
}
