import {Module}              from '@nestjs/common';
import {AccountController}   from './account.controller';
import {TypeOrmModule}       from "@nestjs/typeorm";
import {DATABASE_MODULE}     from "../../lib/database/database.module";
import {Account}             from "./entities/account";
import {AccountService}      from "./account.service";
import {JwtModule}           from "@nestjs/jwt";
import {config}              from "../../lib/config";
import {AccountClientModule} from "../../lib/microservice-clients/account/account-client.module";

@Module({
    imports    : [
        JwtModule.register({
            secret     : config.jwt.secret,
            signOptions: {
                expiresIn: '15m'
            }
        }),
        AccountClientModule,
        TypeOrmModule.forFeature([Account]),
        TypeOrmModule.forRoot({
            ...DATABASE_MODULE,
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
