import { Controller }         from '@nestjs/common'
import { WorldGateway }       from '../world.gateway'
import { NpcDistanceChanged } from '../../distance/actions'
import { EventPattern }       from '@nestjs/microservices'
import { WORLD_PREFIX }       from '../world.prefix'

@Controller()
export class DistanceController {

    constructor(private gateway: WorldGateway) {
    }

    @EventPattern(WORLD_PREFIX + NpcDistanceChanged.event)
    onDistanceChanged(data: NpcDistanceChanged) {
        if (data.data.otherType === 'player') {
            this.gateway.server.to('character.character-id.' + data.data.otherId).emit(NpcDistanceChanged.event, data.data)
        }
    }
}
