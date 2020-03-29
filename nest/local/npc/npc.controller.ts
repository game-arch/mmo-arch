import { Controller, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common'
import { NpcService }                                           from './npc.service'
import { MapOnline, NpcUpdate, PlayerChangedMap, PlayerUpdate } from '../map/actions'
import { EventPattern }                                         from '@nestjs/microservices'
import { WORLD_PREFIX }                                              from '../world/world.prefix'
import { from }                                                      from 'rxjs'
import { Repository }                                                from 'typeorm'
import { MobDistance }                                               from './entities/mob-distance'
import { InjectRepository }                                          from '@nestjs/typeorm'

@Controller()
export class NpcController implements OnApplicationBootstrap, OnApplicationShutdown {

    constructor(private service: NpcService, @InjectRepository(MobDistance) private repo: Repository<MobDistance>) {
    }

    @EventPattern(WORLD_PREFIX + MapOnline.event)
    onMapOnline(data: MapOnline) {
        from(this.service.npcAddedCallbacks)
            .subscribe(callback => callback(data.map))
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
    async onPlayerChangedMap(data:PlayerChangedMap) {
        this.service.onPlayerChangedMap.next(data.id)
        await this.repo.query("DELETE FROM mob_distance WHERE playerInstanceId = ?", [data.id])
    }

    async onApplicationBootstrap() {
        await this.repo.clear()
        this.service.start()
    }

    onApplicationShutdown(signal?: string) {
        this.service.stop()
    }
}
