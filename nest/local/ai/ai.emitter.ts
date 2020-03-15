import { Inject, Injectable } from '@nestjs/common'
import { LOCAL_CLIENT }       from '../../client/client.module'
import { ClientProxy }        from '@nestjs/microservices'

@Injectable()
export class AiEmitter {

    constructor(
        @Inject(LOCAL_CLIENT) protected client: ClientProxy
    ) {
    }
}
