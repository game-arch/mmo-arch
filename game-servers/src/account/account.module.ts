import {Module}            from '@nestjs/common';
import {AccountController} from './account.controller';
import {AccountGateway}    from "./account.gateway";
import {TypeOrmModule}     from "@nestjs/typeorm";
import {DATABASE_MODULE}   from "../lib/database/database.module";
import {Account}           from "./entities/account";
import {AccountService}    from "./account-service";

@Module({
    imports    : [
        TypeOrmModule.forFeature([Account]),
        TypeOrmModule.forRoot({
            ...DATABASE_MODULE,
            type    : 'mysql',
            database: 'account',
            entities: [__dirname + '/**/entities/*{.js,.ts}']
        })
    ],
    controllers: [AccountController],
    providers  : [AccountGateway, AccountService],
    exports    : [AccountGateway]
})
export class AccountModule {
}
