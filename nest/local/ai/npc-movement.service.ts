import { Injectable } from '@nestjs/common'
import { AiEmitter }  from './ai.emitter'

@Injectable()
export class NpcMovementService {

    constructor(private emitter: AiEmitter) {

    }
}
