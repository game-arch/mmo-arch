import { NpcConfig }         from './npc-config'
import { interval, Subject } from 'rxjs'
import { takeUntil }         from 'rxjs/operators'
import { Directions }        from '../../../shared/phaser/directions'

export class NpcMob {
    stop = new Subject()

    directions: Directions = { down: false, left: false, right: false, up: false }

    position = {
        x: 0,
        y: 0
    }

    constructor(private config: NpcConfig) {
        this.position.x = config.position[0]
        this.position.y = config.position[1]
    }

    start(serverStop: Subject<any>) {
        interval(500).pipe(takeUntil(this.stop), takeUntil(serverStop))
                     .subscribe(() => this.update())
    }

    update() {

    }
}
