import { Injectable } from '@nestjs/common'
import { AiEmitter }  from './ai.emitter'

@Injectable()
export class NpcService {

    constructor(private emitter: AiEmitter) {

    }
}
