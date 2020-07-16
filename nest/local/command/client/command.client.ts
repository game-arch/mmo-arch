import { Inject, Injectable }            from '@nestjs/common'
import { ClientProxy }                   from '@nestjs/microservices'
import { LOCAL_CLIENT }                  from '../../../client/client.module'
import { AttemptCommand, CommandAction } from '../../../../shared/actions/command.actions'
import { WorldEvent }                    from '../../../lib/event.types'
import { first }                         from 'rxjs/operators'


@Injectable()
export class CommandClient {

    constructor(@Inject(LOCAL_CLIENT) public client: ClientProxy) {
    }

    attempt(data: CommandAction) {
        return this.client.send(new WorldEvent(AttemptCommand.type), data).pipe(first()).toPromise()
    }
}
