import {Module}            from '@nestjs/common';
import {AccountController} from './account.controller';
import {AccountService}    from './account.service';
import {AccountGateway}    from "./account.gateway";
import {TypeOrmModule}     from "@nestjs/typeorm";
import {DATABASE_MODULE}   from "../lib/database/database.module";

@Module({
    imports    : [TypeOrmModule.forRoot({
        ...DATABASE_MODULE,
        type    : 'mongodb',
        database: 'account',
        entities: [__dirname + '/**/*.entity{.js,.ts}']
    })],
    controllers: [AccountController],
    providers  : [AccountService, AccountGateway],
    exports    : [AccountGateway]
})
export class AccountModule {
}
