import { Module }             from "@nestjs/common";
import { CommerceController } from "./commerce.controller";
import { CommerceService }    from "./commerce.service";
import { TypeOrmModule }      from "@nestjs/typeorm";
import { WorldConstants }     from "../../lib/constants/world.constants";
import * as path              from "path";
import { environment }        from "../../lib/config/environment";

@Module({
    imports    : [TypeOrmModule.forRoot({
        type       : "sqlite",
        database   : path.resolve(environment.dbRoot, WorldConstants.DB_NAME + "_commerce.db"),
        logging    : false,
        synchronize: true,
        entities   : [__dirname + "/entities/*{.ts,.js}"]
    })],
    controllers: [CommerceController],
    providers  : [CommerceService]
})
export class CommerceModule {
}
