import { Module }              from '@nestjs/common'
import { AccountController }   from './account.controller'
import { TypeOrmModule }       from '@nestjs/typeorm'
import { Account }             from './entities/account'
import { AccountService }      from './account.service'
import { JwtModule }           from '@nestjs/jwt'
import { environment }         from '../../lib/config/environment'
import { AccountClientModule } from './client/account-client.module'
import { DB_CONFIG }           from '../../lib/config/db.config'
import { ConnectionOptions }   from 'typeorm'


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
        TypeOrmModule.forRoot(<ConnectionOptions>{
            ...DB_CONFIG,
            database   : 'account',
            entities   : [__dirname + '/entities/*{.ts,.js}']
        })
    ],
    controllers: [AccountController],
    providers  : [AccountService]
})
export class AccountModule {


}
