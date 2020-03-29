import { NpcConfig }           from '../../../shared/interfaces/npc-config'
import { Observable, Subject } from 'rxjs'
import { Directions }          from '../../../shared/phaser/directions'
import { takeUntil }           from 'rxjs/operators'
import { DistanceClient }      from '../distance/client/distance.client'
import { NpcDistance }         from '../../../shared/interfaces/npc-distance'
import { PlayerChangedMap }    from '../map/actions'

export class NpcAI {
    stop = new Subject()

    directions: Directions = { down: false, left: false, right: false, up: false }

    position = {
        x: 0,
        y: 0
    }

    constructor(private config: NpcConfig, private distance: DistanceClient) {
        this.position.x = config.position[0]
        this.position.y = config.position[1]
    }

    start(tick: Observable<number>, onDistanceChange: Observable<NpcDistance>, onPlayerChangedMap: Observable<PlayerChangedMap>) {
        tick
            .pipe(takeUntil(this.stop))
            .subscribe(async (num) => await this.update(num))
        onDistanceChange
            .pipe(takeUntil(this.stop))
            .subscribe(async (data) => await this.distanceUpdated(data))
        onPlayerChangedMap
            .pipe(takeUntil(this.stop))
            .subscribe((data) => {
            })
    }

    async update(num: number) {
    }

    async distanceUpdated(data) {

    }

}
