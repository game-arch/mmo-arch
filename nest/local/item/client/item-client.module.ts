import { Module }       from '@nestjs/common'
import { ClientModule } from '../../../client/client.module'
import { ItemClient }   from './item.client'

@Module({
    imports  : [ClientModule],
    providers: [
        ItemClient
    ],
    exports  : [
        ItemClient
    ]
})
export class ItemClientModule {

}
