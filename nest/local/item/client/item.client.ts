import { Inject, Injectable } from '@nestjs/common'
import { LOCAL_CLIENT }       from '../../../client/client.module'
import { ClientProxy }        from '@nestjs/microservices'

@Injectable()
export class ItemClient {

    constructor(@Inject(LOCAL_CLIENT) private client: ClientProxy) {
    }
}
