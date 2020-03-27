import { Module }          from '@nestjs/common'
import { ClientModule }    from '../../client/client.module'
import { MapClientModule } from '../map/client/map-client.module'
import { AiController }    from './ai.controller'
import { AiEmitter }       from './ai.emitter'
import { NpcService }      from './npc.service'
import { MovementService } from './movement.service'

@Module({
    imports    : [
        ClientModule,
        MapClientModule
    ],
    controllers: [AiController],
    providers  : [AiEmitter, NpcService, MovementService]
})
export class AiModule {

}
