import { Inject, Injectable }         from '@nestjs/common'
import { ClientProxy }                from '@nestjs/microservices'
import { GameWorld }                       from '../../../../shared/interfaces/game-world'
import { GetWorlds, ServerPresenceOnline } from '../../../../shared/actions/server-presence.actions'
import { GLOBAL_CLIENT }                   from '../../../client/client.module'

@Injectable()
export class PresenceEmitter {

    constructor(@Inject(GLOBAL_CLIENT) private client: ClientProxy) {

    }

    sendWorlds(worlds: GameWorld[]) {
        this.client.emit(GetWorlds.type + '.response', new GetWorlds(worlds))
    }

    nowOnline() {
        console.log('NOW ONLINE')
        this.client.emit(ServerPresenceOnline.type, {})
    }
}
