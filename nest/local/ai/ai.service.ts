import { Injectable }        from '@nestjs/common'
import { interval, Subject } from 'rxjs'
import { MapClient }         from '../map/client/map.client'
import { NPC_DATA }          from '../map/npc/npc.data'
import { NpcAI }             from './npc-ai'
import { takeUntil }         from 'rxjs/operators'
import { PlayerChangedMap }  from '../../../shared/events/map.events'

@Injectable()
export class AiService {

    stop$ = new Subject()
    tick  = new Subject<number>()

    mobs: { [mobIndex: number]: NpcAI } = {}

    onDistanceChange   = new Subject<any>()
    onPlayerChangedMap = new Subject<PlayerChangedMap>()

    constructor(private map: MapClient) {

    }

    start() {
        for (let i = 0; i < NPC_DATA.length; i++) {
            this.mobs[i] = new NpcAI(NPC_DATA[i], this.map)
            this.mobs[i].start(
                this.tick,
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