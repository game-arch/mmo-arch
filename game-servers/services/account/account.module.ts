import {Module}              from '@nestjs/common';
import {AccountController}   from './account.controller';
import {TypeOrmModule}       from "@nestjs/typeorm";
import {DB_CONFIG}           from "../../config/db.config";
import {Account}             from "./entities/account";
import {AccountService}      from "./account.service";
import {JwtModule}           from "@nestjs/jwt";
import {environment}         from "../../config/environment";
import {AccountClientModule} from "./client/account-client.module";

@Module({
    imports    : [
        JwtModule.register({
            secret     : environment.jwt.secret,
            signOptions: {
                expiresIn: '15m'
            }
        }),
        AccountClientModule,
        TypeOrmModule.forFeature([Account]),
        TypeOrmModule.forRoot({
            ...DB_CONFIG,
            type    : 'mysql',
            database: 'account',
            entities: [__dirname + '/**/entities/*{.js,.ts}']
        })
    ],
    controllers: [AccountController],
    providers  : [AccountService]
})
export class AccountModule {


}
