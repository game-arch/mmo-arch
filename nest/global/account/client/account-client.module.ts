import { Module }        from '@nestjs/common'
import { AccountClient } from './account.client'
import { ClientModule }  from '../../../client/client.module'


@Module({
    imports  : [ClientModule],
    providers: [
        AccountClient
    ],
    exports  : [
        AccountClient
    ]
})
export class AccountClientModule {

}
