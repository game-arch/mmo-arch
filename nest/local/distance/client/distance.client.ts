import { Inject, Injectable } from '@nestjs/common'
import { LOCAL_CLIENT }       from '../../../client/client.module'
import { ClientProxy }        from '@nestjs/microservices'


@Injectable()
export class DistanceClient {

    constructor(@Inject(LOCAL_CLIENT) public client: ClientProxy) {
    }

}
