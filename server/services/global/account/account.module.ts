import { Module }              from "@nestjs/common";
import { AccountController }   from "./account.controller";
import { TypeOrmModule }       from "@nestjs/typeorm";
import { Account }             from "./entities/account";
import { AccountService }      from "./account.service";
import { JwtModule }           from "@nestjs/jwt";
import { environment }         from "../../../lib/config/environment";
import { AccountClientModule } from "./client/account-client.module";
import * as path               from "path";


@Module({
    imports    : [
        JwtModule.register({
            secret     : environment.jwt.secret,
            signOptions: {
                expiresIn: "15m"
            }
        }),
        AccountClientModule,
        TypeOrmModule.forFeature([Account]),
        TypeOrmModule.forRoot({
            type       : "sqlite",
            database   : path.resolve(environment.dbRoot, "account.db"),
            logging    : false,
            synchronize: true,
            entities   : [__dirname + "/entities/*{.ts,.js}"]
        })
    ],
    controllers: [AccountController],
    providers  : [AccountService]
})
export class AccountModule {


}
