import {ClientProxy}        from '@nestjs/microservices'
import {Inject, Injectable} from '@nestjs/common'

@Injectable()
export class PartyEmitter {
    constructor(@Inject('WORLD_CLIENT') protected client: ClientProxy) {
    }

}
