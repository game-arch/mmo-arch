import { Injectable }        from '@nestjs/common'
import { interval, Subject } from 'rxjs'
import { MapClient }         from '../map/client/map.client'
import { NPC_DATA }       from '../map/npc/npc.data'
import { NpcAI }          from './npc-ai'
import { DistanceClient } from '../distance/client/distance.client'
import { filter, takeUntil } from 'rxjs/operators'
import { PlayerChangedMap }  from '../map/actions'

@Injectable()
export class AiService {

    stop$ = new Subject()
    tick  = new Subject<number>()

    mobs: { [mobIndex: number]: NpcAI } = {}

    onDistanceChange   = new Subject<any>()
    onPlayerChangedMap = new Subject<PlayerChangedMap>()

    constructor(private map: MapClient, private distance: DistanceClient) {

    }

    start() {
        for (let i = 0; i < NPC_DATA.length; i++) {
            this.mobs[i] = new NpcAI(NPC_DATA[i], this.distance)
            this.mobs[i].start(
                this.tick,
                this.onDistanceChange.pipe(filter(data => data.map === NPC_DATA[i].map && data.instanceId === NPC_DATA[i].instanceId)),
                this.onPlayerChangedMap
            )
        }
        let tick = 0
        interval(300)
            .pipe(takeUntil(this.stop$))
            .subscribe(() => this.tick.next(++tick))
    }

    stop() {
        this.mobs = {}
        this.stop$.next()
    }
}
