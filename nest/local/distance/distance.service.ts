import { Injectable }       from '@nestjs/common'
import { NPC_DATA }         from '../map/npc/npc.data'
import { MapClient }        from '../map/client/map.client'
import { Subject }            from 'rxjs'
import { DistanceCalculator } from './distance-calculator'
import { Mob }                from '../../../shared/phaser/mob'
import { Repository }       from 'typeorm'
import { Distance }         from './entities/distance'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class DistanceService {

    stop$ = new Subject()

    mobs: { [mobIndex: number]: DistanceCalculator } = {}

    onNpcUpdate        = new Subject<Mob>()
    onPlayerUpdate     = new Subject<Mob>()
    onPlayerChangedMap = new Subject<number>()

    constructor(private map: MapClient, @InjectRepository(Distance) private repo: Repository<Distance>) {

    }

    start() {
        for (let i = 0; i < NPC_DATA.length; i++) {
            this.mobs[i] = new DistanceCalculator(NPC_DATA[i], this.repo)
            this.mobs[i].start(this.stop$, this.onNpcUpdate, this.onPlayerUpdate, this.onPlayerChangedMap)
        }
    }

    stop() {
        this.mobs = {}
        this.stop$.next()
    }
}
