import { NpcConfig }           from '../../../shared/interfaces/npc-config'
import { Observable, Subject } from 'rxjs'
import { takeUntil }        from 'rxjs/operators'
import { PlayerChangedMap } from '../../../shared/actions/map.actions'
import { MapClient }        from '../map/client/map.client'

export class NpcAI {
    stop = new Subject()


    constructor(private config: NpcConfig, private map: MapClient) {
    }

    start(tick: Observable<number>, onPlayerChangedMap: Observable<PlayerChangedMap>) {
        tick
            .pipe(takeUntil(this.stop))
            .subscribe(async (num) => await this.update(num))
        onPlayerChangedMap
            .pipe(takeUntil(this.stop))
            .subscribe((data) => {
            })
    }

    async update(num: number) {
    }


}
