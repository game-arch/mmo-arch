import { Controller, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common'
import { DistanceService }                                           from './distance.service'
import { NpcUpdate, PlayerChangedMap, PlayerUpdate }                 from '../map/actions'
import { EventPattern }                                              from '@nestjs/microservices'
import { WORLD_PREFIX }                                              from '../world/world.prefix'
import { Repository }                                                from 'typeorm'
import { Distance }                                                  from './entities/distance'
import { InjectRepository }                                          from '@nestjs/typeorm'

@Controller()
export class DistanceController implements OnApplicationBootstrap, OnApplicationShutdown {

    constructor(private service: DistanceService, @InjectRepository(Distance) private repo: Repository<Distance>) {
    }

    @EventPattern(WORLD_PREFIX + NpcUpdate.event)
    onNpcUpdate(data: NpcUpdate) {
        data.npc.map = data.map
        this.service.onNpcUpdate.next(data.npc)
    }

    @EventPattern(WORLD_PREFIX + PlayerUpdate.event)
    onPlayerUpdate(data: PlayerUpdate) {
        data.player.map = data.map
        this.service.onPlayerUpdate.next(data.player)
    }

    @EventPattern(WORLD_PREFIX + PlayerChangedMap.event)
    async onPlayerChangedMap(data: PlayerChangedMap) {
        this.service.onPlayerChangedMap.next(data.id)
        await this.repo.query('DELETE FROM distance WHERE otherType = "player" and otherId = ?', [data.id])
    }

    async onApplicationBootstrap() {
        await this.repo.clear()
        this.service.start()
    }

    onApplicationShutdown(signal?: string) {
        this.service.stop()
    }
}
