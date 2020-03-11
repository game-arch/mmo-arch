import { Module }            from '@nestjs/common'
import { PresenceEmitter }   from './presence.emitter'
import { WorldClientModule } from '../../../../lib/world-client/world-client.module'

@Module({
    imports  : [
        WorldClientModule
    ],
    providers: [
        PresenceEmitter
    ],
    exports  : [
        PresenceEmitter
    ]
})
export class PresenceEmitterModule {

}
