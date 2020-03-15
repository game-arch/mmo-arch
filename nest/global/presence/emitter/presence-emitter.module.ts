import { Module }          from '@nestjs/common'
import { PresenceEmitter } from './presence.emitter'
import { ClientModule }    from '../../../lib/client/client.module'

@Module({
    imports  : [
        ClientModule
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
