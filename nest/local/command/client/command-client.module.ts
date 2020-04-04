import { Module }       from '@nestjs/common'
import { ClientModule }  from '../../../client/client.module'
import { CommandClient } from './command.client'

@Module({
    imports  : [ClientModule],
    providers: [CommandClient],
    exports  : [CommandClient]
})
export class CommandClientModule {

}
