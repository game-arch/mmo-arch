import { Module }       from '@nestjs/common'
import { ClientModule } from '../../../client/client.module'
import { ActionClient } from './action.client'

@Module({
    imports  : [ClientModule],
    providers: [ActionClient],
    exports  : [ActionClient]
})
export class ActionClientModule {

}
