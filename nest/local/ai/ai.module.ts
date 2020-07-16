import { Module }          from '@nestjs/common'
import { ClientModule }    from '../../client/client.module'
import { MapClientModule } from '../map/client/map-client.module'
import { AiController }    from './ai.controller'
import { AiService }       from './ai.service'

@Module({
    imports    : [
        ClientModule,
        MapClientModule
    ],
    controllers: [AiController],
    providers  : [AiService]
})
export class AiModule {

}
