import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy }        from '@nestjs/microservices'
import { LOCAL_CLIENT }       from '../../../client/client.module'
import { AttemptAction }      from '../../../../shared/events/action.events'
import { WorldEvent }         from '../../world/event.types'
import { first }              from 'rxjs/operators'


@Injectable()
export class ActionClient {

    constructor(@Inject(LOCAL_CLIENT) public client: ClientProxy) {
    }

    attempt(data: AttemptAction) {
        return this.client.send(new WorldEvent(AttemptAction.event), data).pipe(first()).toPromise()
    }
}
